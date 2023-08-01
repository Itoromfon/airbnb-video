import { User } from "@prisma/client";

export type SafeInput = Omit<
    User,
    "errors"
> & {
    errors: string;
};