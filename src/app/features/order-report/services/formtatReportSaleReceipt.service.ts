import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Config } from '../models/config';
import { ListProduct } from '../models/saleReports';
import { RootSaleReport } from '../models/saleReports';
import { stickyRows } from '../models/stickyRow';
import { forEach } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class FormtatReportSaleReceiptService {
 
    constructor(private currency: CurrencyPipe, private percent: PercentPipe, private datePipe: DatePipe) {}
    // format data của report đơn bán
    formatReportSale(dataList: RootSaleReport) {
        let dataReturn: any = [];
        let listIds: string[] = [];
        let stickyRows: stickyRows[] = [
            {
                header: 'ĐVT',
                content: 'Tổng: ',
            },
            {
                header: 'Số lượng bán',
                content: dataList.sumOfOrderProduct,
            },
            {
                header: 'Chiết khấu',
                content: this.currency.transform(dataList.sumOfDiscount, 'VND', 'symbol', '1.0-0')!,
            },
            {
                header: 'Doanh số bán',
                content: this.currency.transform(dataList.sumOfTotalPrice, 'VND', 'symbol', '1.0-0')!,
            },
            {
                header: 'Doanh số thuần',
                content: this.currency.transform(
                    dataList.sumOfTotalPayment,
                    'VND',
                    'symbol',
                    '1.0-0',
                )!,
            },
            {
                header: 'Số lượng trả lại',
                content:dataList.sumofTotalReturn,
                
            },
            {
                header: 'Giá trị trả lại',
                content:dataList.sumofMoneyReturn,
                
            }
         
        ];
        dataReturn = dataList.data?.map((data: any, index: number) => {
            listIds.push(data.id);
            let productInfo = this.getProductOrdersInfo(data.listProducts);
            let productCodeArray = productInfo.productCodeArray;
            let productNameArray = productInfo.productNameArray;
            let quantitySaleArray = productInfo.quantitySaleArray;
            let unitArray = productInfo.unitArray;
            let unitPriceArray = productInfo.unitPriceArray;
            let totalPriceArray = productInfo.totalPriceArray;
            let discountArray = productInfo.discountArray;
            let quantityReturnArray = productInfo.quantityReturnArray;
            let moneyReturnArray = productInfo.moneyReturnArray;
            let netSalesArray = productInfo.netSalesArray;
            return [
                // Số thứ tự
                {
                    content: index,
                    hasChildren: false,
                },
                // NGÀY CHỨNG TỪ
                {
                    content: this.datePipe.transform(data.saleDate, 'dd/MM/yyyy'),
                    hasChildren: false,
                },
                // SỐ CHỨNG TỪ
                {
                    content: data.saleCode,
                    hasChildren: false,
                },
                // MÃ KHÁCH HÀNG
                {
                    content: data.customer?.customerCode,
                    hasChildren: false,
                },
                // Tên khách hàng
                {
                    content: data.customer?.customerName,
                    hasChildren: false,
                },
                // Địa chỉ
                {
                    content: data.customer?.address,
                    hasChildren: false,
                },
                // Quận huyện
                {
                    content: data.customer?.district,
                    hasChildren: false,
                },
                // Tỉnh thành
                {
                    content: data.customer?.province,
                    hasChildren: false,
                },
                // Mã phòng nhóm
                {
                    content: data.group?.unitTreeGroup_Code,
                    hasChildren: false,
                },
                // Tên nhân viên đặt hàng
                {
                    content: data.orderEmployee?.employeeName,
                    hasChildren: false,
                },
                // Mã hàng
                {
                    content: productCodeArray,
                    hasChildren: true,
                },
                // Tên hàng
                {
                    content: productNameArray,
                    hasChildren: true,
                },
                // ĐVT
                {
                    content: unitArray,
                    hasChildren: true,
                },
                // Số lượng bán
                {
                    content: quantitySaleArray,
                    hasChildren: true,
                },
                // Đơn giá
                {
                    content: unitPriceArray,
                    hasChildren: true,
                },
                // Doanh số bán
                {
                    content: totalPriceArray,
                    hasChildren: true,
                },
                // Chiết khấu
                {
                    content: discountArray,
                    hasChildren: true,
                },
                // Số lượng trả lại
                {
                    content: quantityReturnArray,
                    hasChildren: true,
                },
                // Giá trị trả lại
                {
                    content: moneyReturnArray,
                    hasChildren: true,
                },
                // Doanh số thuần
                {
                    content: netSalesArray,
                    hasChildren: true,
                },
                // Diễn giải chung
                {
                    content: data.description,
                    hasChildren: false,
                },
            ];
        });
        // để phân biệt ấn vào cột nào sẽ emit gì, biết ấn vào từ màn nào
        let returnInfo: Config = {
            emitTdOrder: 2,
            dataReturn: dataReturn,
            listIds: listIds,
            stickyRows: stickyRows,
        };
      
        return returnInfo;
    }

    getProductOrdersInfo(productList: ListProduct[]) {
        let productCodeArray: any = [];
        let productNameArray: any = [];
        let descriptionArray: any = [];
        let quantityArray: any = [];
        let unitArray: any = [];
        let unitPriceArray: any = [];
        let totalPriceArray: any = [];
        let discountArray: any = [];
        let quantityReturnArray: any = [];
        let quantitySaleArray: any = [];
        let moneyReturnArray: any = [];
        let netSalesArray: any = [];
        let totalReturn:number=0;

        productList?.map((product: ListProduct) => {
            productCodeArray.push(product.productCode);
            productNameArray.push(product.productName);
            descriptionArray.push(product.note);
            unitArray.push(product.unit?.unitName);
            unitPriceArray.push(this.currency.transform(product.unitPrice, 'VND', 'symbol', '1.0-0'));
            totalPriceArray.push(this.currency.transform(product.totalPrice, 'VND', 'symbol', '1.0-0'));
            discountArray.push(this.currency.transform(product.discount, 'VND', 'symbol', '1.0-0'));
            quantityReturnArray.push(product.quantityReturn);
            quantitySaleArray.push(product.quatitySale);
            moneyReturnArray.push(this.currency.transform(product.moneyReturn, 'VND', 'symbol', '1.0-0'));
            netSalesArray.push(
                this.currency.transform((product.totalPrice || 0) - (product.discount || 0), 'VND', 'symbol', '1.0-0'),
            );
        });
        console.log("a")
        console.log(productList)
        quantityReturnArray.forEach((t:number)=>{
          totalReturn+=t+1;
          
        })
        return {
            productCodeArray: productCodeArray,
            productNameArray: productNameArray,
            quantityArray: quantityArray,
            unitArray: unitArray,
            unitPriceArray: unitPriceArray,
            totalPriceArray: totalPriceArray,
            discountArray: discountArray,
            quantityReturnArray: quantityReturnArray,
            moneyReturnArray: moneyReturnArray,
            netSalesArray: netSalesArray,
            quantitySaleArray: quantitySaleArray,
        
            
            
        };
        
        
    }
}
