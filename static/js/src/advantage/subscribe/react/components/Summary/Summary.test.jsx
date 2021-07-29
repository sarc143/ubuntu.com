import React from "react";
import { shallow } from "enzyme";
import { QueryClient, QueryClientProvider } from "react-query";
import Summary from "./Summary";
import * as useProduct from "../../APICalls/useProduct";
import * as usePreview from "../../APICalls/usePreview";

import { product, preview } from "../../utils/test/Mocks";

describe("Summary", () => {
  it("renders correctly with no preview", () => {
    jest.spyOn(useProduct, "default").mockImplementation(() => {
      return { product: { ...product, price: { value: 10000 } }, quantity: 3 };
    });
    jest.spyOn(usePreview, "default").mockImplementation(() => {
      return { data: null };
    });
    const wrapper = shallow(<Summary />);

    expect(wrapper.find("[data-test='name']").text()).toEqual(
      "UA Infrastructure - Essential (Physical)"
    );
    expect(wrapper.find("[data-test='machines']").text()).toEqual(
      "3 x $100.00"
    );
    expect(wrapper.find("[data-test='start-date']").text()).toEqual(
      "29 July 2021"
    );
    expect(wrapper.find("[data-test='end-date']").text()).toEqual(
      "29 July 2022"
    );
    expect(wrapper.find("[data-test='subtotal']").text()).toEqual("$300.00");
  });

  it("renders correctly with no preview and a monthly product", () => {
    jest.spyOn(useProduct, "default").mockImplementation(() => {
      return { product: { ...product, period: "monthly" }, quantity: 1 };
    });
    jest.spyOn(usePreview, "default").mockImplementation(() => {
      return { data: null };
    });
    const wrapper = shallow(<Summary />);

    expect(wrapper.find("[data-test='start-date']").text()).toEqual(
      "29 July 2021"
    );
    expect(wrapper.find("[data-test='end-date']").text()).toEqual(
      "29 August 2021"
    );
  });

  it("renders correctly with a preview with tax amount", () => {
    jest.spyOn(useProduct, "default").mockImplementation(() => {
      return { product: product, quantity: 1 };
    });
    jest.spyOn(usePreview, "default").mockImplementation(() => {
      return {
        data: {
          ...preview,
          taxAmount: 99999,
          total: 12345,
          subscriptionEndOfCycle: null,
        },
      };
    });
    const wrapper = shallow(<Summary />);

    expect(wrapper.find("[data-test='tax']").text()).toEqual("$999.99");
    expect(wrapper.find("[data-test='total']").text()).toEqual("$123.45");
  });

  it("renders correctly with a preview with a different end of cycle", () => {
    jest.spyOn(useProduct, "default").mockImplementation(() => {
      return { product: product, quantity: 1 };
    });
    jest.spyOn(usePreview, "default").mockImplementation(() => {
      return {
        data: {
          ...preview,
          taxAmount: 10000,
          total: 30000,
          subscriptionEndOfCycle: "2042-02-03T16:32:54Z",
        },
      };
    });
    const wrapper = shallow(<Summary />);

    expect(wrapper.find("[data-test='for-this-period']").text()).toEqual(
      "$200.00"
    );
    expect(wrapper.find("[data-test='end-date']").text()).toEqual(
      "03 February 2042"
    );
  });
});
