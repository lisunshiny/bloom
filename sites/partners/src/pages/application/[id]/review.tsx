import React, { useMemo, useState, useContext } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useSWRConfig } from "swr"
import { useRouter } from "next/router"
import { GridApi } from "ag-grid-community"
import { useForm } from "react-hook-form"
import {
  t,
  Button,
  AlertBox,
  AppearanceStyleType,
  useMutate,
  AgTable,
  useAgTable,
  GridSection,
  Modal,
  Field,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import { useSingleFlaggedApplication } from "../../../lib/hooks"
import Layout from "../../../layouts"
import { getCols } from "./applicationsCols"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationFlaggedSet,
  ApplicationReviewStatus,
  EnumApplicationFlaggedSetStatus,
  EnumApplicationFlaggedSetResolveStatus,
  ApplicationFlaggedSetResolve,
} from "@bloom-housing/backend-core/types"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { StatusBar } from "../../../components/shared/StatusBar"

const Flag = () => {
  const router = useRouter()
  const flagsetId = router.query.id as string

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [gridApi, setGridApi] = useState<GridApi | null>(null)

  const columns = useMemo(() => getCols(), [])

  const { data, cacheKey } = useSingleFlaggedApplication(flagsetId)
  const { reset, isSuccess, isLoading, isError } = useMutate<ApplicationFlaggedSet>()
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const { mutate } = useSWRConfig()

  const { mutate: saveSetMutate, isLoading: isSaveLoading } = useMutate()

  const saveSet = (formattedData: ApplicationFlaggedSetResolve) => {
    void saveSetMutate(() =>
      applicationFlaggedSetsService
        .resolve({
          body: formattedData,
        })
        .then(() => {
          // next issue: set success alert
        })
        .catch((e) => {
          // next issue: set failure alert
          console.log(e)
        })
        .finally(() => {
          void mutate(cacheKey)
        })
    )
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues } = useForm()

  const selectFlaggedApps = (data: ApplicationFlaggedSet, gridApi: GridApi) => {
    if (!data || !gridApi) return
    gridApi.forEachNode((row) => {
      row.setSelected(
        row.data.reviewStatus === ApplicationReviewStatus.pendingAndValid ||
          row.data.reviewStatus === ApplicationReviewStatus.valid
      )
    })
  }

  const tableOptions = useAgTable()

  if (!data) return null

  const getTitle = () => {
    if (data.rule === "Email") {
      return t(`flags.emailRule`, {
        email: data?.applications[0].applicant.emailAddress,
      })
    } else if (data?.rule === "Name and DOB") {
      return t("flags.nameDobRule", {
        name: `${data?.applications[0].applicant.firstName} ${data?.applications[0].applicant.lastName}`,
      })
    }
    return ""
  }

  const numberConfirmedApps = data?.applications?.filter(
    (app) => app.reviewStatus === ApplicationReviewStatus.valid
  ).length

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <NavigationHeader
        className="relative"
        title={<p className="font-sans font-semibold text-2xl">{getTitle()}</p>}
      />

      <div>
        <StatusBar
          backButton={
            <Button inlineIcon="left" icon="arrowBack" onClick={() => router.back()}>
              {t("t.back")}
            </Button>
          }
          tagStyle={
            data?.status === EnumApplicationFlaggedSetStatus.resolved
              ? AppearanceStyleType.success
              : AppearanceStyleType.primary
          }
          tagLabel={
            data?.status === EnumApplicationFlaggedSetStatus.resolved
              ? t("t.resolved")
              : t("applications.pendingReview")
          }
        />
      </div>

      <section className="bg-gray-300 py-5">
        <div className="max-w-screen-xl px-5 mx-auto">
          {(isSuccess || isError) && (
            <AlertBox
              className="mb-5"
              type={isSuccess ? "success" : "alert"}
              closeable
              onClose={() => reset()}
            >
              {isSuccess ? t("t.updated") : t("account.settings.alerts.genericError")}
            </AlertBox>
          )}

          <div className="flex md:flex-row flex-col flex-wrap">
            <div className="md:w-9/12 md:pb-24 pb-8">
              {data?.showConfirmationAlert && (
                <AlertBox
                  className="mb-5 mt-1"
                  type={"success"}
                  closeable
                  onClose={async () => {
                    await applicationFlaggedSetsService?.resetConfirmationAlert({
                      body: { id: data.id },
                    })
                    void mutate(cacheKey)
                  }}
                >
                  {numberConfirmedApps !== 1
                    ? t("flags.confirmationAlertPlural", { amount: numberConfirmedApps })
                    : t("flags.confirmationAlertSingular")}
                </AlertBox>
              )}
              <p className={"text-lg font-semibold mb-5"}>{t("flags.selectValidApplications")}</p>
              <AgTable
                id="applications-table"
                className="w-full m-h-0"
                config={{
                  columns,
                  totalItemsLabel: t("applications.totalApplications"),
                  rowSelection: true,
                }}
                data={{
                  items: data.applications ?? [],
                  loading: isLoading,
                  totalItems: data.applications?.length ?? 0,
                  totalPages: 1,
                }}
                search={{
                  setSearch: tableOptions.filter.setFilterValue,
                  showSearch: false,
                }}
                selectConfig={{
                  setGridApi: setGridApi,
                  updateSelectedValues: () => selectFlaggedApps(data, gridApi),
                }}
              />
            </div>

            <aside className="md:w-3/12 md:pl-6">
              <GridSection columns={1} className={"w-full"}>
                <Button
                  styleType={AppearanceStyleType.primary}
                  onClick={() => setSaveModalOpen(true)}
                  dataTestId={"save-set-button"}
                >
                  {t("t.save")}
                </Button>
                {data?.updatedAt && (
                  <div className="border-t text-xs flex items-center justify-center md:mt-0 mt-4 pt-4">
                    {t("t.lastUpdated")}: {dayjs(data?.updatedAt).format("MMMM DD, YYYY")}
                  </div>
                )}
              </GridSection>
            </aside>
          </div>
        </div>
      </section>
      <Modal
        open={!!saveModalOpen}
        title={t("flags.updateStatus")}
        ariaDescription={t("listings.closeThisListing")}
        onClose={() => setSaveModalOpen(false)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.primary}
            size={AppearanceSizeType.small}
            loading={isSaveLoading}
            onClick={() => {
              const selectedData = gridApi.getSelectedRows()
              const status = getValues()["setStatus"]
              saveSet({
                afsId: data?.id,
                applications: selectedData.map((row) => {
                  return { id: row.id }
                }),
                status:
                  status === "pending"
                    ? EnumApplicationFlaggedSetResolveStatus.pending
                    : EnumApplicationFlaggedSetResolveStatus.resolved,
              })
              setSaveModalOpen(false)
            }}
          >
            {t("t.save")}
          </Button>,
          <Button
            type="button"
            size={AppearanceSizeType.small}
            onClick={() => {
              setSaveModalOpen(false)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        <Field
          id="setStatus.pending"
          name="setStatus"
          className="m-0"
          type="radio"
          label={t("applications.pendingReview")}
          register={register}
          inputProps={{
            value: "pending",
            defaultChecked: data?.status === EnumApplicationFlaggedSetStatus.pending,
          }}
        />
        <p className={"mb-6 ml-8 text-xs text-gray-800"}>{t("flags.pendingDescription")}</p>

        <Field
          id="setStatus.resolved"
          name="setStatus"
          className="m-0 border-t pt-6"
          type="radio"
          label={t("t.resolved")}
          register={register}
          inputProps={{
            value: "resolved",
            defaultChecked: data?.status === EnumApplicationFlaggedSetStatus.resolved,
          }}
        />
        <p className={"ml-8 text-xs text-gray-800"}>{t("flags.resolvedDescription")}</p>
      </Modal>
    </Layout>
  )
}

export default Flag
