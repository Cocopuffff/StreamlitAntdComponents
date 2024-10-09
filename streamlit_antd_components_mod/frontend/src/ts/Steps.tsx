import { Streamlit } from "streamlit-component-lib";
import React, { useEffect, useRef, useState } from "react";
import { Steps, ConfigProvider } from "antd";
import { GetColor, insertStyle, RgbaColor, getSize } from "../js/utils.react";
import { strToNode } from "../js/steps.react";
import "../css/steps.css";

interface StepsProp {
  items: any[];
  index: number;
  size: any;
  color: any;
  icon_color_map: { [key: string]: string };
  placement: any;
  direction: any;
  variant: any;
  dot: boolean;
  return_index: boolean;
  kv: any;
  stValue: any;
}

const AntdSteps = (props: StepsProp) => {
  //get data
  const items = strToNode(props["items"]);
  const index = props["index"];
  const size = props["size"];
  const color = props["color"];
  const icon_color_map = props["icon_color_map"] || {};
  const placement = props["placement"];
  const direction = props["direction"];
  const variant = props["variant"];
  const dot = props["dot"];
  const return_index = props["return_index"];
  const kv = props["kv"];
  const primaryColor = GetColor(color == null ? "--primary-color" : color);
  const primaryLightColor = RgbaColor(primaryColor);
  const textColor = GetColor("--text-color");

  const [current, setCurrent] = useState(index);

  // component height
  useEffect(() => {
    setTimeout(() => Streamlit.setFrameHeight(), 0.01);
  });

  let textStyle = `
    .ant-steps-item.ant-steps-item-process.ant-steps-item-custom.ant-steps-item-active .ant-steps-item-container .ant-steps-item-content .ant-steps-item-title {
      font-weight: 600;
    }
    `;
  Object.keys(icon_color_map).forEach((key) => {
    const icon = key;
    const iconColorValue = icon_color_map[key];
    const iconColor = GetColor(iconColorValue);
    const style = `
      .ant-steps .ant-steps-item .ant-steps-icon i.bi.bi-${icon} {
        color: ${iconColor} !important;
      }
      `;
    textStyle += style;
  });
  insertStyle(`sacm.steps.style`, textStyle);

  //callback
  const onChange = (current: any) => {
    setCurrent(current);
    Streamlit.setComponentValue(return_index ? current : kv[current]);
  };

  //listen index and stIndex
  const prevIndex = useRef(props["index"]);
  const prevStValue = useRef(props["stValue"]);
  useEffect(() => {
    const i = props["index"];
    const st_i = props["stValue"];
    if (i !== prevIndex.current && i !== null) {
      setCurrent(i);
      Streamlit.setComponentValue(return_index ? i : kv[i]);
      prevIndex.current = props["index"];
    }
    if (st_i !== prevStValue.current) {
      setCurrent(st_i);
      Streamlit.setComponentValue(return_index ? st_i : kv[st_i]);
      prevStValue.current = props["stValue"];
    }
  }, [props, kv, return_index]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Steps: {
            colorTextLabel: RgbaColor(textColor, 0.5),
            colorFillContent: RgbaColor(textColor, 0.1),
            colorSplit: RgbaColor(textColor, 0.5),
            navArrowColor: RgbaColor(textColor, 0.5),
            colorTextDescription: RgbaColor(textColor, 0.5),
            colorPrimary: primaryColor,
            colorText: "var(--text-color)",
            controlItemBgActive: primaryLightColor,
            customIconFontSize: getSize(size) + 14,
            iconFontSize: getSize(size) - 2,
            iconSize: getSize(size) + 16,
            fontSize: getSize(size) - 2,
            dotSize: getSize(size) - 8,
            dotCurrentSize: getSize(size) - 6,
            iconTop: 0,
            colorIconHover: "red",
          },
        },
      }}
    >
      <Steps
        items={items}
        current={current}
        direction={direction}
        labelPlacement={placement}
        type={variant}
        progressDot={dot}
        onChange={onChange}
      />
    </ConfigProvider>
  );
};

export default AntdSteps;
