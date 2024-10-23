import { z } from "zod";

const GameRecord = z.object({
    attemptCount: z.coerce.number()
        .min(1)
        .max(3)
        .optional(),
    gameover: z.boolean().optional(),
    streak: z.coerce.number()
});

export type GameRecordType = z.infer<typeof GameRecord>;
export default GameRecord;