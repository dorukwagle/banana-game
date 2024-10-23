import { z } from "zod";

const Params = z.object({
    page: z.coerce.number().min(1).optional(),
    pageSize: z.coerce
        .number()
        .min(3, "Page size must be at least 3")
        .optional(),
});

export type ParamsType = z.infer<typeof Params>;
export default Params;
