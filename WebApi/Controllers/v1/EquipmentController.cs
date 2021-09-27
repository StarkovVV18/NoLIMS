﻿using Application.Features.Equipment.Commands;
using Application.Features.Equipment.Commands.CreateEquipment;
using Application.Features.Equipment.Commands.UpdateCommand;
using Application.Features.Equipment.Queries.GetAllEquipment;
using Application.Features.Equipment.Queries.GetEquipmentById;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class EquipmentController : BaseApiController
    {
        private readonly IMapper _mapper;

        public EquipmentController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Equipment.Add)]
        public async Task<IActionResult> Post(CreateEquipmentCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("vo")]
        [Authorize(Policy = PolicyTypes.Equipment.Add)]
        public async Task<IActionResult> CreateVo(CreateVO command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("io")]
        [Authorize(Policy = PolicyTypes.Equipment.Add)]
        public async Task<IActionResult> CreateIo(CreateIO command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("si")]
        [Authorize(Policy = PolicyTypes.Equipment.Add)]
        public async Task<IActionResult> CreateSi(CreateCI command)
        {
            return Ok(await Mediator.Send(command));
        }

        //[HttpPost("delete/{id}")]
        //[Authorize(Policy = PolicyTypes.Equipment.Delete)]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    return Ok(await Mediator.Send(new DeleteProductByIdCommand { Id = id }));
        //}

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Equipment.View)]
        public async Task<IActionResult> Get([FromQuery] GetAllEquipmentParameter filter)
        {
            var query = _mapper.Map<GetAllEquipmentQuery>(filter);
            return Ok(await Mediator.Send(query));
        }

        [HttpGet("detail/{id}")]
        [Authorize(Policy = PolicyTypes.Equipment.View)]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await Mediator.Send(new GetEquipmentByIdQuery { Id = id }));
        }

        [HttpPost("update/{id}")]
        [Authorize(Policy = PolicyTypes.Equipment.Edit)]
        public async Task<IActionResult> Put(int id, UpdateEquipmentCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            return Ok(await Mediator.Send(command));
        }
    }
}
