const db = require('../db/db');
import * as OESFacade from "../services/OESFacade.service";
import { OESAccessDefinition } from "../interfaces/System.interface";

// Get Catchments //
export const getCatchments = async () => {
    let catchments: any;

    await db.query(
        `SELECT * FROM catchments`
      )
    .then((resp: any) => {
        catchments = resp.rows;
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return catchments;
}

// Get Centres //
export const getCentres = async () => {
  let centres: any;

  await db.query(
      `SELECT * FROM centres`
    )
  .then((resp: any) => {
      centres = resp.rows;
  })
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
    });

  return centres;
}

// Get User Permissions //
export const getUserPermissions = async (token: string, userGUID: string) => {
  try{
    const resp = await OESFacade.getUserPermissions(userGUID);
    const permissions = resp.data;
    console.log(permissions);

    const hasAccess: boolean = permissions.some((p: OESAccessDefinition) => p.Application == "RSB"); // If the permissions array contains at least one application == "RSB", user has access
    let catchments: number[] = permissions.map((p: OESAccessDefinition) => {
      let catchmentID: number = parseInt(p.Catchment);
      if (isNaN(catchmentID) || p.Application != "RSB"){
        return -1; // return -1 (filter flag) if no catchment is defined for that access definition, or if the catchment doesn't belong to the RSB application
      }

      return catchmentID - 100; // OES returns the ids starting at 100
    });

    catchments = catchments.filter(c => c != -1); // filter out undesirables
    catchments = [...new Set(catchments)]; // remove duplicates by creating a new Set object

    return { 
      hasAccess: hasAccess,
      catchments: catchments
    };

  } catch(err: any) {
    throw new Error(err);
  }
}

// Get User Profile // 
export const getUserProfile = async (token: string) => {
  try{
    const resp = await OESFacade.getUserProfile(token);
    return resp;

  } catch(err: any) {
    throw new Error(err);
  }
}