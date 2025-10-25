// Validation Schemas for Price Management

import * as v from 'valibot'

// Common validations
const positiveNumber = v.pipe(v.number(), v.minValue(0, 'مقدار باید بزرگتر یا مساوی صفر باشد'))

const requiredString = v.pipe(v.string(), v.trim(), v.minLength(1, 'این فیلد الزامی است'))

// Base price schema
const basePriceSchema = {
  cooperator_id: v.pipe(v.string(), v.minLength(1, 'انتخاب همکار الزامی است')),
  category: requiredString
}

// Papers schema
export const paperPriceSchema = v.object({
  ...basePriceSchema,
  paper_type: requiredString,
  paper_size: requiredString,
  weight: positiveNumber,
  unit_price: positiveNumber
})

// UVs schema
export const uvPriceSchema = v.object({
  ...basePriceSchema,
  uv_type: v.picklist(['glossy', 'matte', 'spot'], 'نوع UV معتبر نیست'),
  surface_area: positiveNumber,
  unit_price: positiveNumber
})

// Cuts schema
export const cutPriceSchema = v.object({
  ...basePriceSchema,
  cut_type: v.picklist(['straight', 'shaped', 'rounded'], 'نوع برش معتبر نیست'),
  material_thickness: positiveNumber,
  price_per_cut: positiveNumber
})

// Lithographies schema
export const lithographyPriceSchema = v.object({
  ...basePriceSchema,
  paper_size: requiredString,
  color_count: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1, 'تعداد رنگ باید حداقل 1 باشد'),
    v.maxValue(8, 'تعداد رنگ نمی‌تواند بیش از 8 باشد')
  ),
  price_per_sheet: positiveNumber
})

// Laminates schema
export const laminatePriceSchema = v.object({
  ...basePriceSchema,
  laminate_type: v.picklist(['glossy', 'matte', 'soft_touch'], 'نوع لمینت معتبر نیست'),
  thickness: positiveNumber,
  price_per_sqm: positiveNumber
})

// Bindings schema
export const bindingPriceSchema = v.object({
  ...basePriceSchema,
  binding_type: v.picklist(['spiral', 'thermal', 'perfect', 'saddle'], 'نوع صحافی معتبر نیست'),
  page_count_min: v.pipe(v.number(), v.integer(), v.minValue(1, 'حداقل تعداد صفحه باید 1 باشد')),
  page_count_max: v.pipe(v.number(), v.integer(), v.minValue(1, 'حداکثر تعداد صفحه باید 1 باشد')),
  unit_price: positiveNumber
})

// Default schema for other categories
export const defaultPriceSchema = v.object({
  ...basePriceSchema,
  name: requiredString,
  description: v.optional(v.string()),
  unit_price: positiveNumber
})

// Schema selector function
export const getPriceSchema = category => {
  const schemas = {
    papers: paperPriceSchema,
    uvs: uvPriceSchema,
    cuts: cutPriceSchema,
    lithographies: lithographyPriceSchema,
    laminates: laminatePriceSchema,
    bindings: bindingPriceSchema
  }

  return schemas[category] || defaultPriceSchema
}

// Validation helper function
export const validatePriceData = (category, data) => {
  try {
    const schema = getPriceSchema(category)
    return v.parse(schema, data)
  } catch (error) {
    if (error instanceof v.ValiError) {
      const fieldErrors = {}
      error.issues.forEach(issue => {
        const field = issue.path?.[0]?.key || 'root'
        fieldErrors[field] = issue.message
      })
      throw new Error(JSON.stringify(fieldErrors))
    }
    throw error
  }
}

// Helper for form default values
export const getDefaultValues = category => {
  const defaults = {
    papers: {
      paper_type: '',
      paper_size: '',
      weight: 0,
      unit_price: 0
    },
    uvs: {
      uv_type: 'glossy',
      surface_area: 0,
      unit_price: 0
    },
    cuts: {
      cut_type: 'straight',
      material_thickness: 0,
      price_per_cut: 0
    },
    lithographies: {
      paper_size: '',
      color_count: 1,
      price_per_sheet: 0
    },
    laminates: {
      laminate_type: 'glossy',
      thickness: 0,
      price_per_sqm: 0
    },
    bindings: {
      binding_type: 'spiral',
      page_count_min: 1,
      page_count_max: 100,
      unit_price: 0
    }
  }

  return (
    defaults[category] || {
      name: '',
      description: '',
      unit_price: 0
    }
  )
}
