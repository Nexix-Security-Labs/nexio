"use client";

import { Dispatch, SetStateAction, useEffect, useState, FC } from "react";
import { observer } from "mobx-react";
import { Controller, useForm } from "react-hook-form";
import { ORGANIZATION_SIZE, RESTRICTED_URLS } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
// constants
// types
import { IWorkspace } from "@plane/types";
// ui
import { Button, CustomSelect, Input, TOAST_TYPE, setToast } from "@plane/ui";
// constants
import { WORKSPACE_CREATED } from "@/constants/event-tracker";
// hooks
import { useEventTracker, useWorkspace } from "@/hooks/store";
import { useAppRouter } from "@/hooks/use-app-router";
// services
import { WorkspaceService } from "@/plane-web/services";

type Props = {
  onSubmit?: (res: IWorkspace) => Promise<void>;
  defaultValues: {
    name: string;
    slug: string;
    organization_size: string;
  };
  setDefaultValues: Dispatch<SetStateAction<IWorkspace>>;
  secondaryButton?: React.ReactNode;
  primaryButtonText?: {
    loading: string;
    default: string;
  };
};

const workspaceService = new WorkspaceService();

export const CreateWorkspaceForm: FC<Props> = observer((props) => {
  const { t } = useTranslation();
  const {
    onSubmit,
    defaultValues,
    setDefaultValues,
    secondaryButton,
    primaryButtonText = {
      loading: t("creating_workspace"),
      default: t("create_workspace"),
    },
  } = props;
  // states
  const [slugError, setSlugError] = useState(false);
  const [invalidSlug, setInvalidSlug] = useState(false);
  // router
  const router = useAppRouter();
  // store hooks
  const { captureWorkspaceEvent } = useEventTracker();
  const { createWorkspace } = useWorkspace();
  // form info
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<IWorkspace>({ defaultValues, mode: "onChange" });

  const handleCreateWorkspace = async (formData: IWorkspace) => {
    await workspaceService
      .workspaceSlugCheck(formData.slug)
      .then(async (res) => {
        if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
          setSlugError(false);

          await createWorkspace(formData)
            .then(async (res) => {
              captureWorkspaceEvent({
                eventName: WORKSPACE_CREATED,
                payload: {
                  ...res,
                  state: "SUCCESS",
                  element: t("create_workspace_page"),
                },
              });
              setToast({
                type: TOAST_TYPE.SUCCESS,
                title: t("success"),
                message: t("workspace_created_successfully"),
              });

              if (onSubmit) await onSubmit(res);
            })
            .catch(() => {
              captureWorkspaceEvent({
                eventName: WORKSPACE_CREATED,
                payload: {
                  state: "FAILED",
                  element: t("create_workspace_page"),
                },
              });
              setToast({
                type: TOAST_TYPE.ERROR,
                title: t("error"),
                message: t("workspace_could_not_be_created_please_try_again"),
              });
            });
        } else setSlugError(true);
      })
      .catch(() => {
        setToast({
          type: TOAST_TYPE.ERROR,
          title: t("error"),
          message: t("workspace_could_not_be_created_please_try_again"),
        });
      });
  };

  useEffect(
    () => () => {
      // when the component unmounts set the default values to whatever user typed in
      setDefaultValues(getValues());
    },
    [getValues, setDefaultValues]
  );

  return (
    <form className="space-y-6 sm:space-y-9" onSubmit={handleSubmit(handleCreateWorkspace)}>
      <div className="space-y-6 sm:space-y-7">
        <div className="space-y-1 text-sm">
          <label htmlFor="workspaceName">
            {t("name_your_workspace")}
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="name"
              rules={{
                required: t("this_is_a_required_field"),
                validate: (value) =>
                  /^[\w\s-]*$/.test(value) ||
                  t("workspaces_names_can_contain_only_space_dash_and_alphanumeric_characters"),
                maxLength: {
                  value: 80,
                  message: t("limit_your_name_to_80_characters"),
                },
              }}
              render={({ field: { value, ref, onChange } }) => (
                <Input
                  id="workspaceName"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setValue("name", e.target.value);
                    setValue("slug", e.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"), {
                      shouldValidate: true,
                    });
                  }}
                  ref={ref}
                  hasError={Boolean(errors.name)}
                  placeholder={t("something_familiar_and_recognizable_is_always_best")}
                  className="w-full"
                />
              )}
            />
            <span className="text-xs text-red-500">{errors?.name?.message}</span>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="workspaceUrl">
            {t("set_your_workspace_url")}
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="flex w-full items-center rounded-md border-[0.5px] border-custom-border-200 px-3">
            <span className="whitespace-nowrap text-sm text-custom-text-200">{window && window.location.host}/</span>
            <Controller
              control={control}
              name="slug"
              rules={{
                required: t("this_is_a_required_field"),
                maxLength: {
                  value: 48,
                  message: t("limit_your_url_to_48_characters"),
                },
              }}
              render={({ field: { onChange, value, ref } }) => (
                <Input
                  id="workspaceUrl"
                  type="text"
                  value={value.toLocaleLowerCase().trim().replace(/ /g, "-")}
                  onChange={(e) => {
                    if (/^[a-zA-Z0-9_-]+$/.test(e.target.value)) setInvalidSlug(false);
                    else setInvalidSlug(true);
                    onChange(e.target.value.toLowerCase());
                  }}
                  ref={ref}
                  hasError={Boolean(errors.slug)}
                  placeholder={t("workspace_name")}
                  className="block w-full rounded-md border-none bg-transparent !px-0 py-2 text-sm"
                />
              )}
            />
          </div>
          {slugError && <p className="-mt-3 text-sm text-red-500">{t("workspace_url_is_already_taken")}</p>}
          {invalidSlug && (
            <p className="text-sm text-red-500">{t("urls_can_contain_only_dash_and_alphanumeric_characters")}</p>
          )}
          {errors.slug && <span className="text-xs text-red-500">{errors.slug.message}</span>}
        </div>
        <div className="space-y-1 text-sm">
          <span>
            {t("how_many_people_will_use_this_workspace")}<span className="ml-0.5 text-red-500">*</span>
          </span>
          <div className="w-full">
            <Controller
              name="organization_size"
              control={control}
              rules={{ required: t("this_is_a_required_field") }}
              render={({ field: { value, onChange } }) => (
                <CustomSelect
                  value={value}
                  onChange={onChange}
                  label={
                    ORGANIZATION_SIZE.find((c) => c === value) ?? (
                      <span className="text-custom-text-400">{t("select_a_range")}</span>
                    )
                  }
                  buttonClassName="!border-[0.5px] !border-custom-border-200 !shadow-none"
                  input
                  optionsClassName="w-full"
                >
                  {ORGANIZATION_SIZE.map((item) => (
                    <CustomSelect.Option key={item} value={item}>
                      {item}
                    </CustomSelect.Option>
                  ))}
                </CustomSelect>
              )}
            />
            {errors.organization_size && (
              <span className="text-sm text-red-500">{errors.organization_size.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {secondaryButton}
        <Button variant="primary" type="submit" size="md" disabled={!isValid} loading={isSubmitting}>
          {isSubmitting ? primaryButtonText.loading : primaryButtonText.default}
        </Button>
        {!secondaryButton && (
          <Button variant="neutral-primary" type="button" size="md" onClick={() => router.back()}>
            {t("go_back")}
          </Button>
        )}
      </div>
    </form>
  );
});
