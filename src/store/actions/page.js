import { PageTypes } from "../action_types";

export const setActivePage = (page) => {
  return async dispatch => {
    dispatch({
      type: PageTypes.SET_SELECTED_PAGE,
      page
    });
  };
}