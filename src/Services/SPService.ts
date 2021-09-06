import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import {Web, Item,  Util,} from "sp-pnp-js";

import { ISPLists } from "../Models/Models";

export default class SPService{
    private _context : any;

    constructor(private context: any) {
        this._context = context;
    }

    public async _getListData(query:string): Promise<ISPLists> {
        return this._context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + query, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
            return response.json();
        });
    }

    public async _getListData1(query:string): Promise<any> {
        return this._context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + query, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
            return response.json();
        });
    }

    public GetItemsWithPublishingRollupImage(listTitle: string, selects: string[]) {
        return new Promise((resolve, reject) => {
            // this array will be all the results once we are done
            const itemsCollector = [];
            // build some query pieces to use
            const items = this._context.web.lists.getByTitle(listTitle).items;
            const query = items.select.apply(items, selects);    
            // get the initial list of items
            query.get().then((results) => {    
                // we will use a batch to save as much as possible on traffic
                const batch = this._context.web.createBatch();
                // now we need to add all the requests to the batch
                // for each item we need to then make a seperate call to get the FieldValuesAsHtml
                for (let i = 0; i < results.length; i++) {
                    // use the Item class to build our request for each item, appending FieldValuesAsHtml to url
                    const htmlValues = new Item(items.getById(results[i].Id), "FieldValuesAsHtml");
                    htmlValues.select("PublishingRollupImage").inBatch(batch).get().then(htmlValue => {    
                        // extend our item and push into the result set
                        itemsCollector.push(Util.extend(results[i], {
                            PublishingRollupImage: htmlValue.PublishingRollupImage,
                        }));
                    });
                }    
                // execute the batch
                batch.execute().then(_ => {
    
                    // use the behavior that all contained promises resolve first to ensure itemsCollector is populated
                    resolve(itemsCollector);
                });
            }).catch(e => {
                reject(e);
            });
        });
    }
}
