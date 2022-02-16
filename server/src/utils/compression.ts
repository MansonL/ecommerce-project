import { schema, normalize } from "normalizr";
import { IMongoMessage } from "../interfaces/messages";

const authorsSchema = new schema.Entity("authors", {}, { idAttribute: "_id" });
const messagesSchema = new schema.Entity(
  "messages",
  {
    author: authorsSchema,
  },
  { idAttribute: "_id" }
);

export const normalizeData = (messages: IMongoMessage[]) => {
  const normalizedData = normalize(messages, [messagesSchema]);
  return normalizedData;
};
