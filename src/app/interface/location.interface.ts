interface ILocation {
  description: string;
  id: string;
  matched_substrings: Array<{length: number, offset: number}>;
  place_id: string,
  reference: string;
  "structured_formatting": {
    main_text: string,
    main_text_matched_substrings: Array<{length: number, offset: number}>;
    secondary_text: string;
  },
  terms: Array<{length: number, offset: number}>;
  types: Array<string>;
}
