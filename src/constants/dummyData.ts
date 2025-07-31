export const dummyWorkspaces: any[] = [
  {
    id: "workspace-1",
    title: "Urban Planning",
    description: "Workspace untuk perencanaan kota",
    workspace_category: {
      id: 1,
      label: "Planning",
      created_at: "2025-01-01T00:00:00Z",
    },
    layers: [
      {
        id: 101,
        workspace_id: 1,
        parent_layer_id: null,
        name: "Zoning Layer",
        data: {
          id: 1001,
          layer_id: 101,
          documents: [
            {
              id: 1,
              file_name: "zoning.pdf",
              file_path: "/docs/zoning.pdf",
              file_url: "https://example.com/docs/zoning.pdf",
              file_mime_type: "application/pdf",
              file_size: 204800,
            },
          ],
          bbox: [110.1, -7.1, 110.5, -6.9],
          bbox_center: [110.3, -7.0],
          geojson: {
            type: "FeatureCollection",
            features: [],
          },
          created_at: "2025-01-02T00:00:00Z",
          updated_at: "2025-01-03T00:00:00Z",
          deleted_at: "",
        },
      },
    ],
  },
  {
    id: "workspace-2",
    title: "Environmental Survey",
    description: "Data survei lingkungan 2025",
    workspace_category: {
      id: 2,
      label: "Environment",
    },
    layers: [
      {
        id: 102,
        workspace_id: 2,
        parent_layer_id: null,
        name: "Vegetation Cover",
        description: "Vegetasi hutan dan semak",
        table_name: "vegetation_layer",
        data: {
          id: 1002,
          layer_id: 102,
          documents: [],
          bbox: [109.8, -7.3, 110.2, -7.0],
          bbox_center: [110.0, -7.15],
          geojson: {
            type: "FeatureCollection",
            features: [],
          },
          created_at: "2025-01-05T00:00:00Z",
          updated_at: "2025-01-06T00:00:00Z",
          deleted_at: "",
        },
      },
    ],
    thumbnail: [
      {
        id: 2,
        file_name: "thumb.jpg",
        file_path: "/thumbnails/thumb.jpg",
        file_url: "https://example.com/thumb.jpg",
        file_mime_type: "image/jpeg",
        file_size: 102400,
      },
    ],
  },
];
