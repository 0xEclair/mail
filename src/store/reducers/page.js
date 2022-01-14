import { PageTypes } from "../action_types";

export const page = (state = {}, action) => {
  switch (action.type) {
    case PageTypes.SET_SELECTED_PAGE: {
      return {
        selectedPage: action.page
      };
    }
    default: {
      return state
    }
  }
}