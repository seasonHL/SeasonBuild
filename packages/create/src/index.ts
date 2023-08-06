import create from "./commands";
import dotenv from "dotenv";

dotenv.config();

create().catch((e) => console.error(e));
