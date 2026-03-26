import { z } from "zod";


export const CustomerProfileSchema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name can only contain letters and spaces",
    }),
});

export const ProfileSchema = z.object({
  userName: z.string().min(3),
  fullName: z.string().min(2),
  about: z.string().min(10),
  shopName: z.string().trim().optional(),
  shopAddress: z.object({
    address: z.string(),
    city: z.string(),
  }).optional(),
  yearsOfExperience: z.string(),

 
  serviceModes: z
    .array(z.enum(["HOME", "SHOP", "EVENT", "CONSULTATION"]))
    .min(1, { message: "Please select at least one service mode" }),
}).superRefine((data, ctx) => {
  if (data.serviceModes?.includes("SHOP")) {
    if (!data.shopName || data.shopName.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shop name is required", path: ["shopName"] });
    }
    if (!data.shopAddress?.address || data.shopAddress.address.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shop address is required", path: ["shopAddress", "address"] });
    }
    if (!data.shopAddress?.city || data.shopAddress.city.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["shopAddress", "city"] });
    }
  }
});

export const BankDetailsSchema = z
  .object({
    accountHolderName: z
      .string()
      .min(2, { message: "Account holder name is required" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name must contain only letters and spaces",
      }),

    accountNumber: z
      .string()
      .regex(/^\d{9,18}$/, {
        message: "Account number must be 9-18 digits",
      }),

    confirmAccountNumber: z.string(),

    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: "Invalid IFSC code format (e.g., SBIN0001234)",
      }),

    bankName: z
      .string()
      .min(2, { message: "Bank name is required" }),

    upiId: z
      .string()
      .regex(/^[\w.\-]+@[\w.\-]+$/, {
        message: "Invalid UPI ID format (e.g., username@bank)",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers do not match",
    path: ["confirmAccountNumber"],
  });


  export const ChangePasswordSchema=z.object({
    oldPassword:z.string().min(1,'current password is required'),
    newPassword:z.string()
     .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data)=>data.newPassword===data.confirmPassword,{
    message:"passwords don't match",
   path:['confirmPassword']
  })

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
export type CustomerProfileType = z.infer<typeof CustomerProfileSchema>;
export type ProfileType = z.infer<typeof ProfileSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;