import { StopSearchRecord } from "@/types";

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const convertApiRecord = (record: Record<string, unknown>): StopSearchRecord => {
  const getString = (key: string, fallback: string = 'Not specified'): string => {
    return String(record[key] || record[snakeToCamel(key)] || fallback);
  };

  const getBoolean = (key: string, fallback: boolean = false): boolean => {
    return Boolean(record[key] || record[snakeToCamel(key)] || fallback);
  };

  const getNullableString = (key: string): string | null => {
    const value = record[key] || record[snakeToCamel(key)];
    return value ? String(value) : null;
  };

  const getNullableBoolean = (key: string): boolean | null => {
    const value = record[key] || record[snakeToCamel(key)];
    return value !== undefined ? Boolean(value) : null;
  };

  return {
    ageRange: getString('age_range'),
    outcome: getString('outcome'),
    involvedPerson: getBoolean('involved_person'),
    selfDefinedEthnicity: getString('self_defined_ethnicity'),
    gender: getString('gender'),
    legislation: getNullableString('legislation'),
    outcomeLinkedToObjectOfSearch: getNullableBoolean('outcome_linked_to_object_of_search'),
    datetime: getString('datetime'),
    removalOfMoreThanOuterClothing: getBoolean('removal_of_more_than_outer_clothing'),
    outcomeObject: {
      id: getString('outcome_object.id', ''),
      name: getString('outcome_object.name', 'Not specified')
    },
    location: (() => {
      if (record.location) {
        const location = record.location as Record<string, unknown>;
        const street = location.street as Record<string, unknown> | undefined;
        
        return {
          latitude: String(location.latitude || ''),
          street: {
            id: street ? Number(street.id) || 0 : 0,
            name: street ? String(street.name || 'Not specified') : 'Not specified'
          },
          longitude: String(location.longitude || '')
        };
      }
      return null;
    })(),
    operation: getNullableString('operation'),
    officerDefinedEthnicity: getNullableString('officer_defined_ethnicity'),
    type: getString('type'),
    operationName: getNullableString('operation_name'),
    objectOfSearch: getString('object_of_search')
  };
};
