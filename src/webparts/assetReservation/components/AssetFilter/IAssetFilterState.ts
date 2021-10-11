import { IDropdownOption } from "office-ui-fabric-react";
import { IAssetInfo } from "../../../../models/IAssetInfo";

export interface IAssetFilterState {
    assetList :IDropdownOption[];
    assetInfo: IAssetInfo[];
    selectedAsset: IAssetInfo;
    errorMessage: string;
}