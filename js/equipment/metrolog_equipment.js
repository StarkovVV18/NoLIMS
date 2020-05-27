Vue.config.devtools = true;
Vue.component('equipment-grid', {
	template: '#equipment-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		checkEq: Object,
		handoff: Object
	},
	data: function () {
		let sortColumns = {};
		this.columns.forEach(function (key){
			Object.keys(key).some(function(row){
				if (row !== 'action')
					sortColumns[row] = 1;
			});
		});
		return {
			sortKey: '',
			sortColumns: sortColumns,
			currentPage: 1,
			listPages: [],
			selectAllMaterials: false,
			selectedEquipments: [],
			tags: {
				is_archive: 'Архив',
				is_conservation: 'Консервация',
				is_repair: 'Ремонт',
				is_check: 'ЦСМ',
				is_working: 'Используется'
			}
		}
	},
	methods: {
		sortBy: function (key) {
			if(key === 'action') return;
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
		},
		setPages () {
			let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
			for (let i = 1; i <= numOfPage; i++)
				this.listPages.push(i);
		},
		paginate (rows) {
			let page = this.currentPage;
			let curPost = this.countPost;
			let from = (page * curPost) - curPost;
			let to = ((page * curPost));
			return rows.slice(from, to);
		},
		showModal(modalName, id = null, department = null){
			this.checkEq.id_equipment = id;
			this.handoff.department = department;
			$('#modal' + modalName).modal('show');
		},
		//ТАК НЕ ДЕЛАТСЯ
		showModalHandoff(modalName, id = null, department = null, id_to = null){
			this.handoff.department = department;
			this.handoff.id_equipment = id;
			this.handoff.id_department_to = id_to;
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		select() {
			this.selectedEquipments = [];
			if (!this.selectAllMaterials)
				for (let i in this.paginateRows)
					this.selectedEquipments.push({
						id_equipment: this.paginateRows[i].id,
						is_archive: this.paginateRows[i].is_archive,
						is_conservation: this.paginateRows[i].is_conservation,
						is_repair: this.paginateRows[i].is_repair,
						is_check: this.paginateRows[i].is_check,
						is_working: this.paginateRows[i].is_working
					});
					// this.selectedEquipments.push(this.paginateRows[i].id);
		},
		Details(id_equipment)
		{
			// "'details/' + equipment.id" КОСТЫЛЬ
			document.location.href = '/equipment/details/' + id_equipment;
		},
		GetSticker() {
			if(this.selectedEquipments.length > 0)
				axios.post("/equipment/create-sticker", JSON.stringify(this.selectedEquipments), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(window.open(response.data))).catch(error => (this.listError = error));
		},
		GetCard() {
			if(this.selectedEquipments.length > 0)
			{
				let obj;//{tag: tag, eq: this.selectedEquipments};
				let obj1 = [];
				for (let item in this.selectedEquipments)
					obj1.push(this.selectedEquipments[item].id_equipment);
				obj = {id: obj1};
				// console.log(this.obj1);
				axios.post("/equipment/create-card", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(window.open(response.data))).catch(error => (this.listError = error));
			}
		},
		setTag(tag){
			if(this.selectedEquipments.length > 0)
			{
				let obj;//{tag: tag, eq: this.selectedEquipments};
				let obj1 = [];
				for (let item in this.selectedEquipments)
					obj1.push(this.selectedEquipments[item].id_equipment);
				obj = {tag: tag, eq: obj1};
				console.log(obj);
				// axios.post("/equipment/set-tag", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>(demo1.getEquipments(), this.selectedEquipments = [])).catch(error => (this.listError = error));
			}
		},
		returnUniq(column){
			let result = [];
			for (let str of column)
				if (!result.includes(str))
					result.push(str);
			return result;
		}
	},
	watch: {
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = this.rows;
			if (sortKey)
			{
				rows = rows.slice().sort(function (a, b) {
					a = a[sortKey];
					b = b[sortKey];
					if(a === b) return 0 * order;
					else if (a > b) return 1 * order;
					else return - 1 * order;
				})
			}
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					if(r.total === null) r.total = r.amount;
						return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
		tagsFromSelected(){
			// key[row] == value
			// key == object
			// row == name key
			let rows = this.selectedEquipments;
			let tagg = this.tags;
			let obj_id = []; //Хранение id выделенного оборудования
			let obj_tags = {}; //Хранение тегов выделенного оборудования
			let result = []; //Уникальные теги из obj_tags
			let obj; //Возвращаемый объект
				//Выбранные элементы
				rows.forEach(function(key)
				{
					let tags = [];
					Object.keys(key).forEach(function(row)
					{
						if(row === 'id_equipment')
							obj_id.push(key[row]);
						else if(key[row])
						{
							Object.keys(tagg).forEach(function(tag)
							{
								if(row === tag) obj_tags[tag]=tagg[tag];
								// console.log(obj_tags);
							});
							// let result = [];
							// for (let i in obj_tags)
							// 	result.push([i, obj_tags[i]]);
							// result.sort(function(a, b) {
							// 	return a[1] - b[1];
							// });
							// obj_tags = Object.keys(obj_tags).sort(function(a,b){return obj_tags[a]-obj_tags[b]})
							// Object.keys(obj_tags).forEach(function(tag){
							// 		if (!result.includes(tag))
							// 		{
							// 			result.push(tag);
										// result = result.slice().sort(function (a, b)
										// {
										// 	if(a === b) return 0 ;
										// 	else if (a > b) return 1;
										// 	else return - 1;
										// });
							// 		}
							// })
							//Возврат уникальных значений из тегов
							// for (let str of obj_tags)
							// 	if (!result.includes(str))
							// 	{
							// 		result.push(str);
							// 		result = result.slice().sort(function (a, b)
							// 		{
							// 			if(a === b) return 0 ;
							// 			else if (a > b) return 1;
							// 			else return - 1;
							// 		});
							// 	}
						}
					});
				});
				obj = {id_equipment: obj_id, tags: obj_tags};
			return obj;
		}
	},
})

let demo1 = new Vue({
	el: '#demo1',
	data: {
		gridColumns: {
			tableColumn: [
				{'number':'Номер'},
				{'equipment':'Оборудование'},
				{'serial_number':'С/Н'},
				{'date_current_check':'Текущая'},
				{'date_next_check':'Следующая'},
				{'Tag': 'Метка'},
				{'action': ''}
			],
			filterColumn: [
				{'number':'Номер'},
				{'department':'Отдел'},
				{'type':'Вид'},
				{'equipment':'Оборудование'},
				{'serial_number':'S/N'},
				{'date_current_check':'Текущая проверка'},
				{'date_next_check':'Следующая проверка'},
				{'is_archive':'Архив'},
				{'is_conservation':'Консервация'},
				{'is_check':'Проверка'},
				{'is_repair':'Ремонт'},
				{'is_working':'В работе'}
			]
		},
		gridData: [],
		filters: {
			number: [],
			department: [],
			type: [],
			equipment: [],
			date_current_check: [],
			date_next_check: [],
			is_archive: [],
			is_conservation: [],
			is_check: [],
			is_repair: [],
			is_working: []
		},
		countPost: 100,
		check: {
			id_equipment: null,
			date_current_check: null,
			date_next_check: null,
			number_document: null,
			id_upload_document_type: null,
			upload_file_name: [],
		},
		handoff: {
			id_equipment: null,
			department: null,
			id_department_to: null
		},
		listDocType: [],
		listDepartment: []
	},
	methods: {
		getEquipments(){
			axios.get("/equipment/get-equipments").then( response => (this.gridData = response.data));
		},
		getDocType(){
			axios.get("/equipment/get-doc-type").then( response => (this.listDocType = response.data));
		},
		getDepartment(){
			axios.get("/equipment/get-department").then( response => (this.listDepartment = response.data));
		},
		setDropdown(){
			console.log($('.dropdown').dropdown({fullTextSearch: true}));
		},
		handleFileUpload(){
			this.check.upload_file_name[0] = this.$refs.upload_file_name.files[0];
		},
		submitFile(){
			//ПЕРЕКИДЫВАЕТ В ERROR
			let formData = new FormData();
			formData.append('id_equipment', this.check.id_equipment);
			formData.append('date_current_check', this.check.date_current_check);
			formData.append('date_next_check', this.check.date_next_check);
			formData.append('id_upload_document_type', this.check.id_upload_document_type);
			formData.append('number_document', this.check.number_document);
			formData.append('upload_file_name', this.check.upload_file_name[0]);
			axios.post('/equipment/change-check', formData, {headers:{'Content-Type': 'multipart/form-data'}
			}).then(response => (this.getEquipments(), this.check.file[0] = [], this.check = {})).catch(error => (alert('ОШИБКА ЗАГРУЗКИ ФАЙЛА')));
		},
		setHandoff(){
			axios.post("/equipment/set-handoff", JSON.stringify(this.handoff), {headers: {'Content-Type': 'application/json'}}).then
			(response => (this.getEquipments(), this.handoff = {})).catch(error => (this.listError = error));
		},
		returnUniq(column){
			let result = [];
			for (let str of this.gridData)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				})
			return result;
		}
	},
	watch: {
		gridData(){
			let interval = setInterval(function()
			{ 
				if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
					$('.dropdown').dropdown({fullTextSearch: true});
				else clearInterval(interval);
			}, 1000);
		}
	},
	mounted: function() {
		this.getEquipments();
		this.getDepartment();
		this.getDocType();
	}
});