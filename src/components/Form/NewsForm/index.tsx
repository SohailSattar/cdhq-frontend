import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dropdown, ImageUploader, ShadowedContainer, TextBox } from "../..";
import { useStore } from "../../../utils/store";
import Button from "../../Button";
import { DropdownOption } from "../../Dropdown";
import { INewsFormInputs } from "../types";

import styles from "./styles.module.scss";
import { getNewsTypes } from "../../../api/news/get/getNewsTypes";
import UploadImages from "../../UploadImages";
import { APINewsDetail } from "../../../api/news/types";

interface Props {
  data?: APINewsDetail;
  onSubmit: (data: INewsFormInputs) => void;
}

const NewsForm: FC<Props> = ({ data, onSubmit }) => {
  const [t] = useTranslation("common");
  const language = useStore((state) => state.language);

  const [file, setFile] = useState<File>();
  const [imageName, setImageName] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
  } = useForm<INewsFormInputs>({ criteriaMode: "all" });

  const [newsTypeList, setNewsTypeList] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getNewsTypes();

      if (data) {
        setNewsTypeList(
          data?.map((d) => {
            return {
              label: `${d.name}  -  ${d.nameEnglish}`,
              value: d.id,
            };
          })
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Project Name
    register("title", {
      required: "Ttile is required.",
      // pattern: {
      // 	value: /[\u0621-\u064As]+$/,
      // 	message: 'Name should only be in arabic alphabets.',
      // },
    });

    // Employee Name
    register("shortSummary", {
      required: "Short summary is required.", //'Short summary is required.',
      // pattern: {
      // 	value: /[\u0621-\u064As]+$/,
      // 	message: 'Name should only be in alphabets.',
      // }
    });

    // Project Group
    register("newsType", {
      required: "News Type is required.",
      // pattern: {
      // 	value: /[\u0621-\u064As]+$/,
      // 	message: 'Name should only be in alphabets.',
      // }
    });

    // Project Group
    register("fullNews", {
      required: "News is required.",
      // pattern: {
      // 	value: /[\u0621-\u064As]+$/,
      // 	message: 'Name should only be in alphabets.',
      // }
    });

    if (data) {
      const { id, title, shortSummary, newsType, fullNews } = data;

      setValue("title", title);
      setValue("shortSummary", shortSummary);

      const selectedNewsType = newsTypeList.find(
        (x) => x.value === newsType?.id!
      );

      setValue("newsType", selectedNewsType!);
      setValue("fullNews", fullNews);
    }
  }, [data, language, register]);

  const submitHandler = (values: INewsFormInputs) => {
    onSubmit(values);
  };

  const imageChngeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
    if (evnt.target.files) {
      setValue("thumbnail", evnt.target.files[0]);
      setFile(evnt.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className={styles.newForm}>
        <div className={styles.row}>
          <div className={styles.basic}>
            <div className={styles.field}>
              <Controller
                render={({ field: { value, onChange } }) => (
                  <TextBox
                    type="text"
                    label={t("news.title", { framework: "React" })}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="title"
                control={control}
                defaultValue={""}
              />
            </div>

            <div className={styles.field}>
              <Controller
                render={({ field: { value, onChange } }) => (
                  <TextBox
                    type="text"
                    label={t("news.shortSummary", { framework: "React" })}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="shortSummary"
                control={control}
                defaultValue={""}
              />
            </div>

            <div className={styles.ddlField}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label={t("news.type", { framework: "React" })}
                    options={newsTypeList}
                    onSelect={onChange}
                    value={value}
                  />
                )}
                name="newsType"
                control={control}
                defaultValue={{ label: "", value: "" }}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.actions}>
                <div className={language !== "ar" ? styles.btn : styles.btnLTR}>
                  {/* <Button type='submit'>{actionButtonText}</Button> */}
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* <ImageUploader/> */}
            <div>
              {/* <Controller
                render={({ field: { onChange } }) => (
                  <input type="file" onChange={(e) => imageChngeHandler(onChange)} accept="image/*" />
                )}
                name="thumbnail"
                control={control}
              /> */}
              <input
                type="file"
                name="thumbnail"
                onChange={imageChngeHandler}
                accept="image/*"
              />
            </div>
            <div>
              <img src={imageName} alt="" />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.field}>
            <Controller
              render={({ field: { value, onChange } }) => (
                <TextBox
                  type="text"
                  label={t("news.fullNews", { framework: "React" })}
                  value={value}
                  onChange={onChange}
                  multiline={true}
                  maxRows={20}
                />
              )}
              name="fullNews"
              control={control}
              defaultValue={""}
            />
          </div>
          {/* <div>
            <UploadImages />
          </div> */}
        </div>
        <div>
          {Object.keys(errors).length > 0 && (
            <ShadowedContainer>
              <ErrorMessage
                errors={errors}
                name="title"
                render={({ messages }) => {
                  return messages
                    ? _.entries(messages).map(([type, message]) => (
                        <p key={type} className="error">
                          {message}
                        </p>
                      ))
                    : null;
                }}
              />

              {/* Name English */}
              <ErrorMessage
                errors={errors}
                name="shortSummary"
                render={({ messages }) => {
                  return messages
                    ? _.entries(messages).map(([type, message]) => (
                        <p key={type} className="error">
                          {message}
                        </p>
                      ))
                    : null;
                }}
              />

              {/* News Type*/}
              <ErrorMessage
                errors={errors}
                name="newsType"
                render={({ messages }) => {
                  return messages
                    ? _.entries(messages).map(([type, message]) => (
                        <p key={type} className="error">
                          {message}
                        </p>
                      ))
                    : null;
                }}
              />

              {/* Detail */}
              <ErrorMessage
                errors={errors}
                name="fullNews"
                render={({ messages }) => {
                  return messages
                    ? _.entries(messages).map(([type, message]) => (
                        <p key={type} className="error">
                          {message}
                        </p>
                      ))
                    : null;
                }}
              />
            </ShadowedContainer>
          )}
        </div>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
};

export default NewsForm;
