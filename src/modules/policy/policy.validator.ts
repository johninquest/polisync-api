// src/modules/policy/policy.validator.ts
import Joi from 'joi';

export const policySchema = Joi.object({
  id: Joi.string().length(21).optional(),
  policy_type: Joi.string().required(),
  policy_number: Joi.string().required(),
  insurer: Joi.string().required(),
  policy_comment: Joi.string().optional().allow(null, ''),
  start_date: Joi.date().optional().allow(null),
  end_date: Joi.date().required(),
  automatic_renewal: Joi.boolean().default(false),
  created_by: Joi.string().required(),
  premium: Joi.number().required().min(0),
  payment_frequency: Joi.number().integer().required().min(0),
  agent: Joi.string().optional().allow(null, ''),
  claims: Joi.array().items(Joi.string()).optional().default([]),
  deleted_at: Joi.date().optional().allow(null),
  created: Joi.date().optional(),
  updated: Joi.date().optional(),
});

export const validatePolicy = (policy: any) => {
  return policySchema.validate(policy, { abortEarly: false });
};

// You might want to add specific validation functions for create/update operations
export const validatePolicyCreation = (policy: any) => {
  // You can customize this to not require certain fields that get default values, etc.
  return policySchema.validate(policy, { abortEarly: false });
};

export const validatePolicyUpdate = (policy: any) => {
  // For updates, fields can be optional since you might only update some fields
  const updateSchema = policySchema.fork(
    [
      'policy_type', 
      'policy_number', 
      'insurer',
      'end_date',
      'created_by',
      'premium',
      'payment_frequency'
    ], 
    (schema) => schema.optional()
  );
  
  return updateSchema.validate(policy, { abortEarly: false });
};

// Add specific validation for soft delete operation if needed
export const validatePolicyDelete = (policy: any) => {
  const deleteSchema = Joi.object({
    deleted_at: Joi.date().required()
  });
  
  return deleteSchema.validate(policy, { abortEarly: false });
};