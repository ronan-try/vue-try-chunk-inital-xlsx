/**
 * @/utils/index
 */
import * as XLSX from 'xlsx'

// 方法内 使用XLSX
export const excelToJson = () => {
    console.warn('@/utils/index.excelToJson is used')
    return XLSX + 'excelToJson' + XLSX.utils;
}

// 方法内 未使用XLSX
export const test = () => {
    console.warn('@/utils/index.test is used')
    return 'test'
}

// 方法内 未使用XLSX
export const test2 = () => {
    console.warn('@/utils/index.test2 is used')
    return 'test2'
}
