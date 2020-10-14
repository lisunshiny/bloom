import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { UnitsService } from "./units.service"
import { UnitDto } from "./unit.dto"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { plainToClass } from "class-transformer"

@Controller("/units")
@ApiTags("units")
@ApiBearerAuth()
@ResourceType("unit")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: "List units", operationId: "list" })
  async list(): Promise<UnitDto[]> {
    return plainToClass(UnitDto, await this.unitsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create unit", operationId: "create" })
  async create(@Body() unit: UnitCreateDto): Promise<UnitDto> {
    return plainToClass(UnitDto, await this.unitsService.create(unit))
  }

  @Put(`:unitId`)
  @ApiOperation({ summary: "Update unit", operationId: "update" })
  async update(@Body() unit: UnitUpdateDto): Promise<UnitDto> {
    return plainToClass(UnitDto, await this.unitsService.update(unit))
  }

  @Get(`:unitId`)
  @ApiOperation({ summary: "Get unit by id", operationId: "retrieve" })
  async retrieve(@Param("unitId") unitId: string): Promise<UnitDto> {
    return plainToClass(UnitDto, await this.unitsService.findOne({ where: { id: unitId } }))
  }

  @Delete(`:unitId`)
  @ApiOperation({ summary: "Delete unit by id", operationId: "delete" })
  async delete(@Param("unitId") unitId: string): Promise<void> {
    return await this.unitsService.delete(unitId)
  }
}
