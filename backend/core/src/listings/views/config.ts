import { Views } from "./types"

function getBaseAddressSelect(schemas: string[]): string[] {
  const fields = ["city", "state", "street", "street2", "zipCode", "latitude", "longitude"]

  let select: string[] = []
  schemas.forEach((schema) => {
    select = select.concat(fields.map((field) => `${schema}.${field}`))
  })
  return select
}

const views: Views = {
  base: {
    select: [
      "listings.id",
      "listings.name",
      "listings.applicationDueDate",
      "listings.applicationDueTime",
      "listings.applicationOpenDate",
      "listings.reviewOrderType",
      "listings.status",
      "listings.waitlistMaxSize",
      "listings.waitlistCurrentSize",
      "image.id",
      "image.fileId",
      "image.label",
      "listings.assets",
      "reservedCommunityType.id",
      "reservedCommunityType.name",
      "property.id",
      "property.unitsAvailable",
      ...getBaseAddressSelect(["buildingAddress"]),
      "units.id",
      "units.floor",
      "units.minOccupancy",
      "units.maxOccupancy",
      "units.monthlyIncomeMin",
      "units.monthlyRent",
      "units.monthlyRentAsPercentOfIncome",
      "units.sqFeet",
      "units.status",
      "amiChartOverride.id",
      "amiChartOverride.items",
      "unitType.id",
      "unitType.name",
    ],
    leftJoins: [
      { join: "listings.image", alias: "image" },
      { join: "listings.property", alias: "property" },
      { join: "property.buildingAddress", alias: "buildingAddress" },
      { join: "property.units", alias: "units" },
      { join: "units.unitType", alias: "unitType" },
      { join: "units.amiChartOverride", alias: "amiChartOverride" },
      { join: "listings.reservedCommunityType", alias: "reservedCommunityType" },
      { join: "listings.preferences", alias: "preferences" },
    ],
  },
}

views.detail = {
  select: [
    ...views.base.select,
    "listings.additionalApplicationSubmissionNotes",
    "listings.applicationFee",
    "listings.applicationOrganization",
    "listings.applicationPickUpAddressOfficeHours",
    "listings.applicationPickUpAddressType",
    "listings.applicationDropOffAddressOfficeHours",
    "listings.applicationDropOffAddressType",
    "listings.buildingSelectionCriteria",
    "listings.costsNotIncluded",
    "listings.creditHistory",
    "listings.criminalBackground",
    "listings.depositMin",
    "listings.depositMax",
    "listings.disableUnitsAccordion",
    "listings.jurisdiction",
    "listings.leasingAgentEmail",
    "listings.leasingAgentName",
    "listings.leasingAgentOfficeHours",
    "listings.leasingAgentPhone",
    "listings.leasingAgentTitle",
    "listings.postmarkedApplicationsReceivedByDate",
    "listings.programRules",
    "listings.rentalAssistance",
    "listings.rentalHistory",
    "listings.requiredDocuments",
    "listings.specialNotes",
    "listings.whatToExpect",
    "listings.displayWaitlistSize",
    "listings.reservedCommunityDescription",
    "listings.reservedCommunityMinAge",
    "listings.resultLink",
    "listings.isWaitlistOpen",
    "listings.waitlistOpenSpots",
    "listings.customMapPin",
    "applicationMethods.id",
    "applicationMethods.label",
    "applicationMethods.externalReference",
    "applicationMethods.acceptsPostmarkedApplications",
    "applicationMethods.phoneNumber",
    "applicationMethods.type",
    "paperApplications.id",
    "paperApplications.language",
    "paperApplicationFile.id",
    "paperApplicationFile.fileId",
    "paperApplicationFile.label",
    "listingEvents.id",
    "listingEvents.type",
    "listingEvents.startTime",
    "listingEvents.endTime",
    "listingEvents.url",
    "listingEvents.note",
    "listingEvents.label",
    "listingEventFile.id",
    "listingEventFile.fileId",
    "listingEventFile.label",
    "result.id",
    "result.fileId",
    "result.label",
    ...getBaseAddressSelect([
      "applicationAddress",
      "leasingAgentAddress",
      "applicationPickUpAddress",
      "applicationMailingAddress",
    ]),
    "leasingAgents.firstName",
    "leasingAgents.lastName",
    "leasingAgents.email",
    "preferences.title",
    "preferences.subtitle",
    "preferences.description",
    "preferences.ordinal",
    "preferences.links",
    "preferences.formMetadata",
    "preferences.page",
  ],
  leftJoins: [
    ...views.base.leftJoins,
    { join: "listings.applicationMethods", alias: "applicationMethods" },
    { join: "applicationMethods.paperApplications", alias: "paperApplications" },
    { join: "paperApplications.file", alias: "paperApplicationFile" },
    { join: "listings.events", alias: "listingEvents" },
    { join: "listingEvents.file", alias: "listingEventFile" },
    { join: "listings.result", alias: "result" },
    { join: "listings.applicationAddress", alias: "applicationAddress" },
    { join: "listings.leasingAgentAddress", alias: "leasingAgentAddress" },
    { join: "listings.applicationPickUpAddress", alias: "applicationPickUpAddress" },
    { join: "listings.applicationMailingAddress", alias: "applicationMailingAddress" },
    { join: "listings.applicationDropOffAddress", alias: "applicationDropOffAddress" },
    { join: "listings.leasingAgents", alias: "leasingAgents" },
  ],
}

views.full = {
  leftJoinAndSelect: [
    ["listings.applicationMethods", "applicationMethods"],
    ["applicationMethods.paperApplications", "paperApplications"],
    ["paperApplications.file", "paperApplicationFile"],
    ["listings.image", "image"],
    ["listings.events", "listingEvents"],
    ["listingEvents.file", "listingEventFile"],
    ["listings.result", "result"],
    ["listings.applicationAddress", "applicationAddress"],
    ["listings.leasingAgentAddress", "leasingAgentAddress"],
    ["listings.applicationPickUpAddress", "applicationPickUpAddress"],
    ["listings.applicationMailingAddress", "applicationMailingAddress"],
    ["listings.applicationDropOffAddress", "applicationDropOffAddress"],
    ["listings.leasingAgents", "leasingAgents"],
    ["listings.preferences", "preferences"],
    ["listings.property", "property"],
    ["property.buildingAddress", "buildingAddress"],
    ["property.units", "units"],
    ["units.amiChartOverride", "amiChartOverride"],
    ["units.unitType", "unitTypeRef"],
    ["units.unitRentType", "unitRentType"],
    ["units.priorityType", "priorityType"],
    ["units.amiChart", "amiChart"],
    ["listings.jurisdiction", "jurisdiction"],
    ["listings.reservedCommunityType", "reservedCommunityType"],
  ],
}

export { views }
