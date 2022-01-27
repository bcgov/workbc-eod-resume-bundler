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

    // If the permissions array contains at least one entry with application "RSB", user has access
    const hasAccess: boolean = permissions.some((p: OESAccessDefinition) => p.Application.toLowerCase() === "rsb");

    let catchments: number[] = permissions.map((p: OESAccessDefinition) => {
      let catchmentID: number = parseInt(p.Catchment);
      if (isNaN(catchmentID) || p.Application.toLowerCase() !== "rsb"){
        return -1; // return -1 (filter flag) if no catchment is defined for that access definition, or if the catchment doesn't belong to the RSB application
      }

      return catchmentID - 100; // OES returns the ids starting at 100
    });

    let isManager: boolean = false;
    let managesCatchments: number[] = permissions.map((p: OESAccessDefinition) => {
      let catchmentID: number = parseInt(p.Catchment);
      if (isNaN(catchmentID) || p.Application.toLowerCase() !== "rsb"){
        return -1; // return -1 (filter flag) if no catchment is defined for that access definition, or if the catchment doesn't belong to the RSB application
      }

      if (p.Application.toLowerCase() === "rsb" && p.Role.toLowerCase() === "administrator"){
        isManager = true; // If the permissions array contains at least one entry with application "RSB" and role "Administrator", user is a manager
        return catchmentID - 100; // OES returns the ids starting at 100
      }

      return -1; // catch-all
    });

    catchments = catchments.filter(c => c != -1); // filter out undesirables
    catchments = [...new Set(catchments)]; // remove duplicates by creating a new Set object
    managesCatchments = managesCatchments.filter(c => c != -1);
    managesCatchments = [...new Set(managesCatchments)];

    return { 
      hasAccess: hasAccess,
      catchments: catchments,
      isManager: isManager,
      managesCatchments: managesCatchments
    };

  } catch(err: any) {
    throw new Error(err);
  }
}