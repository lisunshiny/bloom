import React, { useState } from "react"
import Head from "next/head"
import axios from "axios"
import { t, AlertBox, SiteAlert, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Listing, ListingStatus } from "@bloom-housing/backend-core/types"
import { ListingStatusBar } from "../../../components/listings/ListingStatusBar"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import Layout from "../../../layouts/index"
import Aside from "../../../components/listings/Aside"
import { ListingContext } from "../../../components/listings/ListingContext"
import DetailListingData from "../../../components/listings/PaperListingDetails/sections/DetailListingData"
import DetailListingIntro from "../../../components/listings/PaperListingDetails/sections/DetailListingIntro"
import DetailListingPhoto from "../../../components/listings/PaperListingDetails/sections/DetailListingPhoto"
import DetailBuildingDetails from "../../../components/listings/PaperListingDetails/sections/DetailBuildingDetails"
import DetailAdditionalDetails from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalDetails"
import DetailAdditionalEligibility from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalEligibility"
import DetailLeasingAgent from "../../../components/listings/PaperListingDetails/sections/DetailLeasingAgent"
import DetailAdditionalFees from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalFees"
import { DetailUnits } from "../../../components/listings/PaperListingDetails/sections/DetailUnits"
import DetailUnitDrawer, {
  UnitDrawer,
} from "../../../components/listings/PaperListingDetails/DetailsUnitDrawer"
import DetailBuildingFeatures from "../../../components/listings/PaperListingDetails/sections/DetailBuildingFeatures"
import DetailRankingsAndResults from "../../../components/listings/PaperListingDetails/sections/DetailRankingsAndResults"
import DetailApplicationTypes from "../../../components/listings/PaperListingDetails/sections/DetailApplicationTypes"
import DetailApplicationAddress from "../../../components/listings/PaperListingDetails/sections/DetailApplicationAddress"
import DetailApplicationDates from "../../../components/listings/PaperListingDetails/sections/DetailApplicationDates"
import DetailPreferences from "../../../components/listings/PaperListingDetails/sections/DetailPreferences"
import DetailCommunityType from "../../../components/listings/PaperListingDetails/sections/DetailCommunityType"
import DetailPrograms from "../../../components/listings/PaperListingDetails/sections/DetailPrograms"

interface ListingProps {
  listing: Listing
}

export default function ListingDetail(props: ListingProps) {
  const { listing } = props
  const [errorAlert, setErrorAlert] = useState(false)
  const [unitDrawer, setUnitDrawer] = useState<UnitDrawer>(null)

  if (!listing) return null

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <>
          <Layout>
            <Head>
              <title>{t("nav.siteTitlePartners")}</title>
            </Head>
            <SiteAlert type="success" timeout={5000} dismissable sticky={true} />
            <NavigationHeader
              title={listing.name}
              listingId={listing.id}
              tabs={{
                show: listing.status !== ListingStatus.pending,
                listingLabel: t("t.listingSingle"),
                applicationsLabel: t("nav.applications"),
              }}
              breadcrumbs={
                <Breadcrumbs>
                  <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
                  <BreadcrumbLink href={`/listings/${listing.id}`} current>
                    {listing.name}
                  </BreadcrumbLink>
                </Breadcrumbs>
              }
            />

            <ListingStatusBar status={listing.status} />

            <section className="bg-primary-lighter">
              <div className="mx-auto px-5 mt-5 max-w-screen-xl">
                {errorAlert && (
                  <AlertBox
                    className="mb-5"
                    onClose={() => setErrorAlert(false)}
                    closeable
                    type="alert"
                  >
                    {t("authentication.signIn.errorGenericMessage")}
                  </AlertBox>
                )}

                <div className="flex flex-row flex-wrap ">
                  <div className="info-card md:w-9/12 overflow-hidden">
                    <DetailListingData />
                    <DetailListingIntro />
                    <DetailListingPhoto />
                    <DetailBuildingDetails />
                    <DetailCommunityType />
                    <DetailUnits setUnitDrawer={setUnitDrawer} />
                    <DetailPreferences />
                    <DetailPrograms />
                    <DetailAdditionalFees />
                    <DetailBuildingFeatures />
                    <DetailAdditionalEligibility />
                    <DetailAdditionalDetails />
                    <DetailRankingsAndResults />
                    <DetailLeasingAgent />
                    <DetailApplicationTypes />
                    <DetailApplicationAddress />
                    <DetailApplicationDates />
                  </div>

                  <div className="w-full md:w-3/12 md:pl-6">
                    <Aside type="details" />
                  </div>
                </div>
              </div>
            </section>
          </Layout>

          <DetailUnitDrawer unit={unitDrawer} setUnitDrawer={setUnitDrawer} />
        </>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)
  } catch (e) {
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}
