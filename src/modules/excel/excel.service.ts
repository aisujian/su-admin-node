import { Excel } from './entities/excel.entity';
import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const xlsx = require('node-xlsx');
const XLSXParser = require('xlsx-to-json');
import page from '../../common/utils/page';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private excelRepository: Repository<Excel>,
  ) {}
  create(createExcelDto: CreateExcelDto) {
    console.log(createExcelDto, 'createExcelDto');
    return this.excelRepository.insert(createExcelDto);
  }
  async findByPage(queryParams) {
    const qb = this.excelRepository.createQueryBuilder();
    const pageHelper = {
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
    };
    const result = await page.findByPage(qb, pageHelper);
    console.log(result, 'result');
    return { queryParams };
  }
  async findAll(queryParams) {
    const take = queryParams.pageSize || 10;
    const skip = queryParams.pageNumber || 0;
    const keyword = queryParams.keyword || '';
    const [result, total] = await this.excelRepository.findAndCount({
      where: {
        name: Like('%' + keyword + '%'),
      },
      order: {
        name: 'DESC',
      },
      take,
      skip,
    });
    return {
      data: result,
      page: {
        firstPage: true,
        hasNextPage: true,
        hasPreviousPage: false,
        lastPage: false,
        pageNum: skip,
        pageSize: take,
        pageTotal: 19,
        total,
      },
    };
  }

  findOne(id: number) {
    return this.excelRepository.findOne(id);
  }

  update(id: number, updateExcelDto: UpdateExcelDto) {
    return `This action updates a #${id} excel`;
  }

  remove(id: number) {
    return `This action removes a #${id} excel`;
  }

  analysis(file) {
    const filePath = file[0].path;
    const sheets = xlsx.parse(filePath);
    const sheetData = sheets[0].data;
    const dataList = [];
    sheetData.forEach((item, index) => {
      if (index === 0) return; // ???????????????
      dataList.push({
        name: item[0], // ????????????
        username: item[1], // ??????
        password: item[2], // ??????
        market_user_number: item[3], // ??????????????????
        contract_number: item[4], // ????????????
        predict: item[5], // ????????????
        bilateral: item[6], // ??????
        bidding: item[7], // ??????
        transfer: item[8], // ??????????????????
        bilateral_settlement: item[9], // ????????????
        bidding_settlement: item[10], // ????????????
        summary_quantity: item[11], // ????????????
        deviation_electric: item[12], // ????????????
        deviation_proportion: item[13], // ????????????
        price_markup: item[14], // ?????????????????????
        settlement: item[15], // ??????????????????
        price_difference: item[16], // ??????
        plant_name: item[17], // ????????????
        belong_company: item[18], // ????????????
        belong_power_supply: item[19], // ???????????????
        contacts: item[20], // ?????????
        remarks: item[21], // ??????
      });
    });
    // ???????????????
    dataList.forEach((item, index) => {
      if (index === 0) return; // ???????????????
      const preItem = dataList[index - 1];
      !item.name && (item.name = preItem['name']);
      !item.username && (item.username = preItem['username']);
      !item.password && (item.password = preItem['password']);
      !item.belong_company && (item.belong_company = preItem['belong_company']);
      !item.belong_power_supply &&
        (item.belong_power_supply = preItem['belong_power_supply']);
      !item.contacts && (item.contacts = preItem['contacts']);
    });

    console.log(dataList, 'dataList');

    return dataList;
  }
}
