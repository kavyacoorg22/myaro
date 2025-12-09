import {z} from "zod";

export const Step1Schema=z.object({
  yearsOfExperience: z.number()
    .int()
    .min(1, { message: "minimum 1 digit" })
    .max(99, { message: "maximum 2 digits allowed" }),
  about:z.string().trim()
        .min(15,{message:"Tell us little more"})
        .max(300,{message:"Keep it under 300 characters"})
        .refine(v=> /\S/.test(v), { message: "Cannot be only whitespace" })
})


export  type Step1Data=z.infer<typeof Step1Schema>



const shopSchema = z.object({
  shopName: z.string().trim().min(3, { message: "Shop name is required" }),
  address: z.string().trim().min(20, { message: "Address is required" }),
  city: z.string().trim().min(3, { message: "City is required" }),
  pincode: z.string().regex(/^\d{4,6}$/, { message: "Enter a valid pincode (4-6 digits)" }),
  photos: z.array(z.string().url()).min(3, { message: "Upload 1-3 shop photos" }).max(5),
  license: z.array(z.string().url()).max(2).optional(),
});


const uploadsSchema = z.object({
  portfolio: z.array(z.string().url()).min(3, { message: "Add at least 3 portfolio images" }).max(10),
  certificates: z.array(z.string().url()).max(5).optional(),
});


export const Step2Schema = z.discriminatedUnion("hasShop", [
  z.object({ hasShop: z.literal(false), uploads: uploadsSchema }),
  z.object({ hasShop: z.literal(true), uploads: uploadsSchema, shop: shopSchema }),
]);


export type Step2Data = z.infer<typeof Step2Schema>;

export const Step3Schema = z.object({
  accountHolderName: z.string()
    .trim()
    .min(3, { message: "Account holder name is required (minimum 3 characters)" })
    .refine(v => /\S/.test(v), { message: "Cannot be only whitespace" }),
  
  accountNumber: z.string()
    .trim()
    .min(8, { message: "Enter a valid account number" })
    .max(18, { message: "Account number too long" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
  
  confirmAccountNumber: z.string()
    .trim()
    .min(8, { message: "Please confirm your account number" }),
  
  ifscCode: z.string()
    .trim()
    .length(11, { message: "IFSC code must be 11 characters" })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Enter a valid IFSC code (e.g., HDFC0001234)" }),
  
  bankName: z.string()
    .trim()
    .min(3, { message: "Bank name is required" })
    .refine(v => /\S/.test(v), { message: "Cannot be only whitespace" }),
  
  upiId: z.string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[\w.-]+@[\w.-]+$/.test(val),
      { message: "Enter a valid UPI ID (e.g., name@bank)" }
    ),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers do not match",
  path: ["confirmAccountNumber"],
});

export type Step3Data = z.infer<typeof Step3Schema>;