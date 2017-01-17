export interface PrestaConfiguration {
  apiKey: string;
  shopUrl: string;
}
export interface Query {
  resource?   :string;
  display?    :string;
  filter?     :string;
  filterArgs? :string;
  sort?       :string;
  limit?      :string;
}
