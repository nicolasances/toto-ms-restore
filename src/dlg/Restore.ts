import { Request } from "express";
import { ExecutionContext } from "toto-api-controller/dist/model/ExecutionContext";
import { TotoDelegate } from "toto-api-controller/dist/model/TotoDelegate";
import { UserContext } from "toto-api-controller/dist/model/UserContext";
import { ValidationError } from "toto-api-controller/dist/validation/Validator";
import { ControllerConfig } from "../Config";
import { ExpensesAPI } from "../api/ExpensesAPI";
import { extractAuthHeader } from "../util/AuthHeader";
import { GamesAPI } from "../api/GamesAPI";
import { KudAPI } from "../api/KudAPI";

export class Restore implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const config = execContext.config as ControllerConfig
        const authHeader = String(extractAuthHeader(req))
        const logger = execContext.logger
        const cid = execContext.cid

        // Extract needed data
        const date = req.body.date;

        // Verify that there is a restore date
        if (!date) throw new ValidationError(400, "No date provided. You need a date to be able to restore the data.")

        // Verify that the user connected is the only that is allowed to restore the data
        if (userContext.email != config.totoRestoreUser) throw new ValidationError(403, `User ${userContext.email} is not authorized to perform a restore.`)

        // Start the restore for each service
        // Expenses API
        logger.compute(cid, `Restoring Expenses Backup of [${date}]`)

        await new ExpensesAPI(userContext, execContext, authHeader).restore(date)

        logger.compute(cid, `Done restoring Expenses Backup of [${date}]`)

        // Games API
        logger.compute(cid, `Restoring Games Backup of [${date}]`)

        await new GamesAPI(userContext, execContext, authHeader).restore(date)

        logger.compute(cid, `Done restoring Games Backup of [${date}]`)

        // Kud API
        logger.compute(cid, `Restoring Kud Backup of [${date}]`)

        await new KudAPI(userContext, execContext, authHeader).restore(date)

        logger.compute(cid, `Done restoring Kud Backup of [${date}]`)

        return { restore: "done" }

    }

}
