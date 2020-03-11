/**
 * 操作符枚举类
 */
const optEnum = {
  // 等于 =
  equalsTo: 10,

  // 大于 >
  greaterThan: 11,

  // 大于等于 >=
  greaterThanOrEqualTo: 12,

  // 小于 <
  lessThan: 13,

  // 小于等于 <=
  lessThanOrEqualTo: 14,

  // 不等于 <>
  notEqualsTo: 19,

  // 在区间 between
  between: 20,

  // 不在区间 not between
  notBetween: 29,

  // 像 like
  like: 30,

  // 不像 not like
  notLike: 39,

  // 在范围 in
  in: 40,

  // 不在范围 not in
  notIn: 49,

  // 是空, is null
  isNull: 50,

  // 不是空 is not null
  isNotNull: 59
}

export { optEnum }

/**
 * 通过实体对象和操作符，构建(like)查询参数
 * @param {*} data 实体查询条件对象
 * @param {*} opts 操作符对象，要求实体对象中有的属性，在操作符对象中必须有相同的属性名
 * @param {all, left, right} type 构建like条件的类型
 */
export function buildParamLike (data, opts, type) {
  const result = {}
  let value
  for (const key in data) {
    if (opts[key] === optEnum.like || opts[key] === optEnum.notLike) {
      if (type === 'all') {
        value = '%' + data[key] + '%'
      } else if (type === 'left') {
        value = '%' + data[key]
      } else if (type === 'left') {
        value = data[key] + '%'
      } else {
        value = data[key]
      }
      result[key] = value
    } else {
      result[key] = data[key]
    }
  }
  return result
}
