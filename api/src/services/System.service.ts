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
export const getUserPermissions = async (token: string, params: any) => {
  try{
    const resp = await OESFacade.getUserPermissions(token, params);
    const permissions = resp.data;

    // If the permissions array contains at least one role == "resume bundler", user has access //
    const hasAccess: boolean = permissions.some((p: OESAccessDefinition) => p.Role?.toLowerCase() == "resume bundler");
    let catchments: number[] = permissions.map((p: OESAccessDefinition) => {
      let catchmentID: number = parseInt(p.Catchment);
      if (isNaN(catchmentID)){
        return -1; // return null if no catchment is defined for that access definition
      }

      return catchmentID - 100; // OES returns the ids starting at 100
    });

    catchments = catchments.filter(c => c != -1);

    //return permissions;
    return { 
      hasAccess: hasAccess,
      catchments: catchments
    };

  } catch(err: any) {
    throw new Error(err);
  }
}