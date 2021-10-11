import { IAssetInfo } from "../../../../models/IAssetInfo";

export interface IAssetFilterProps {
    context:any;
    siteUrl: string;
    EventKeySelection(info: IAssetInfo) : void;
}