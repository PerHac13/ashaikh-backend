import { z } from "zod";

// identity validation
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export const validateLogin = (data) => {
  return loginSchema.safeParse(data);
};

// experience validation
const roleTypeEnum = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Remote",
  "Onsite",
  "Hybrid",
];

const experienceBaseSchema = z.object({
  startDate: z.coerce.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  currentlyWorking: z.boolean({
    required_error: "Currently working status is required",
    invalid_type_error: "Currently working must be a boolean",
  }),
  featured: z.boolean({
    required_error: "Featured status is required",
    invalid_type_error: "Featured must be a boolean",
  }),
  organization: z
    .string({
      required_error: "Organization is required",
    })
    .min(2, "Organization must be at least 2 characters")
    .max(100, "Organization cannot exceed 100 characters")
    .trim(),
  currentPosition: z
    .string({
      required_error: "Current position is required",
    })
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position cannot exceed 100 characters")
    .trim(),
  previousPositions: z.array(z.string()).default([]),
  roleType: z.enum(roleTypeEnum, {
    required_error: "Role type is required",
    invalid_type_error: "Invalid role type",
  }),
  description: z
    .array(
      z.string({
        required_error: "Description is required",
      })
    )
    .min(1, "At least one description point is required"),
  skills: z
    .array(
      z.string({
        required_error: "Skills are required",
      })
    )
    .min(1, "At least one skill is required"),
});

const createExperienceSchema = experienceBaseSchema
  .extend({
    endDate: z.coerce
      .date()
      .optional()
      .nullable()
      .refine((date) => {
        if (date && date <= new Date()) return true;
        return date === null;
      }, "End date must be in the past or current date"),
  })
  .refine(
    (data) => {
      if (!data.currentlyWorking && !data.endDate) return false;
      if (data.endDate && data.endDate < data.startDate) return false;
      return true;
    },
    {
      message:
        "End date must be after start date or currently working must be true",
      path: ["endDate"],
    }
  );

const updateExperienceSchema = createExperienceSchema.partial();

const deleteExperienceSchema = z.object({
  id: z
    .string({
      required_error: "Experience ID is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid experience ID format"),
});

export const validateCreateExperience = (data) =>
  createExperienceSchema.safeParse(data);
export const validateUpdateExperience = (data) =>
  updateExperienceSchema.safeParse(data);
export const validateDeleteExperience = (data) =>
  deleteExperienceSchema.safeParse(data);

// Project validation
const projectBaseSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),

  tag: z.array(z.string()).optional().default([]),

  madeAt: z.string().optional().default(""),

  imagePath: z
    .string()
    .url("Invalid image URL")
    .optional()
    .default(
      "https://res.cloudinary.com/dmknbak4t/image/upload/v1739515347/pexels-luis-gomes-166706-546819_vr4jlv.jpg"
    ),

  link: z
    .array(z.string().url("Invalid URL format"))
    .min(1, "At least one link is required"),

  featured: z.boolean({
    required_error: "Featured status is required",
    invalid_type_error: "Featured must be a boolean",
  }),

  startDate: z.coerce.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),

  currentlyWorking: z.boolean().optional().default(false),

  description: z
    .array(z.string())
    .min(1, "At least one description point is required"),

  skill: z.array(z.string()).min(1, "At least one skill is required"),

  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be negative")
    .optional()
    .default(0),
});

const createProjectSchema = projectBaseSchema
  .extend({
    endDate: z.coerce
      .date()
      .optional()
      .nullable()
      .refine((date) => {
        if (date && date <= new Date()) return true;
        return date === null;
      }, "End date must be in the past or current date"),
  })
  .refine(
    (data) => {
      if (!data.currentlyWorking && !data.endDate) return false;
      if (data.endDate && data.endDate < data.startDate) return false;
      return true;
    },
    {
      message:
        "End date must be after start date or currently working must be true",
      path: ["endDate"],
    }
  );

const updateProjectSchema = createProjectSchema.partial();

const deleteProjectSchema = z.object({
  id: z
    .string({
      required_error: "Project ID is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID format"),
});

export const validateCreateProject = (data) =>
  createProjectSchema.safeParse(data);
export const validateUpdateProject = (data) =>
  updateProjectSchema.safeParse(data);
export const validateDeleteProject = (data) =>
  deleteProjectSchema.safeParse(data);
