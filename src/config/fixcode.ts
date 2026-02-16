export interface SystemCode {
  code: number;
  type_code: number;
  type_desc: string;
  code_desc: string;
}

export const SYSTEM_CODES: SystemCode[] = [
  { code: 10011001, type_code: 1001, type_desc: '状态', code_desc: '有效' },
  { code: 10011002, type_code: 1001, type_desc: '状态', code_desc: '无效' },
  { code: 10021001, type_code: 1002, type_desc: '性别', code_desc: '男' },
  { code: 10021002, type_code: 1002, type_desc: '性别', code_desc: '女' },
  { code: 10021003, type_code: 1002, type_desc: '性别', code_desc: '未知' },
  { code: 10031001, type_code: 1003, type_desc: '是否', code_desc: '是' },
  { code: 10031002, type_code: 1003, type_desc: '是否', code_desc: '否' },
  { code: 20011001, type_code: 2001, type_desc: '员工状态', code_desc: '在职' },
  { code: 20011002, type_code: 2001, type_desc: '员工状态', code_desc: '离职' },
  { code: 20011003, type_code: 2001, type_desc: '员工状态', code_desc: '退休' },
  { code: 20011004, type_code: 2001, type_desc: '员工状态', code_desc: '离岗退养' },
];

export const SystemCodeTypes = {
  STATUS: 1001,
  SEX: 1002,
  YES_NO: 1003,
  EMPLOYEE_STATUS: 2001,
};

export const SystemStatus = {
  ACTIVE: 10011001,
  INACTIVE: 10011002,
};

export const SystemSex = {
  MALE: 10021001,
  FEMALE: 10021002,
  UNKNOWN: 10021003,
};

export const SystemEmployeeStatus = {
  ON_JOB: 20011001,
  RESIGNED: 20011002,
  RETIRED: 20011003,
  EARLY_RETIREMENT: 20011004,
};

export function getCodeDesc(typeCode: number, value: number | string): string {
  // Try to find exact match first (standard use case)
  const exactMatch = SYSTEM_CODES.find(
    (item) => item.type_code === typeCode && item.code == value
  );
  if (exactMatch) return exactMatch.code_desc;

  // Fallback: sometimes values might be passed as simple 0/1 integers instead of full codes
  // This handles the userStatus 0/1 mapping mentioned in earlier design discussions if needed,
  // though the design now specifies strict system codes.
  // For now, strict match is preferred. Return empty string or original value as string if not found.
  return String(value);
}

export function getCodesByType(typeCode: number): SystemCode[] {
  return SYSTEM_CODES.filter((item) => item.type_code === typeCode);
}
