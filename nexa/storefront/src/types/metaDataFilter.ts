export type MetadataFilter = {
    size?: number;
    chest_cm?: number;
    waist_cm?: number;
    back_length_cm?: number;
    front_length_cm?: number;
    sleeve_length_cm?: number;
};

export const createDefaultMetadataFilter = (overrides: Partial<MetadataFilter> = {}): MetadataFilter => {
    return {
        size: 0,
        chest_cm: 0,
        sleeve_length_cm: 0,
        ...overrides
    };
};