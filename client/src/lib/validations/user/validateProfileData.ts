import { z } from "zod";


export const ProfileSchema = z.object({
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

  about: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters" }),

  shopName: z.string().trim().optional(),
 shopAddress: z.object({
    address: z.string(),
    city: z.string(),
  }).optional(),

  yearsOfExperience: z.string(),
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


export type ProfileType = z.infer<typeof ProfileSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;