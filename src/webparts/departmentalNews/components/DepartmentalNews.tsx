import * as React from 'react';
import styles from './DepartmentalNews.module.scss';
import { IDepartmentalNewsProps } from './IDepartmentalNewsProps';
import  SPService from '../../../services/SPService';
import { IDepartmentalNews} from '../../../Models/IDeprmentalNews';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

export interface IDepartmentalNewsState
{
  departmentalNews: IDepartmentalNews[];
}

debugger;
export default class DepartmentalNews extends React.Component<IDepartmentalNewsProps, IDepartmentalNewsState> {

  private sp: SPService;
  constructor(props: IDepartmentalNewsProps, IDepartmentalNewsState){
    super(props);
    this.sp = new SPService(this.props.webPartContext);
    this.state = {
      departmentalNews: []
    }
  }

  componentDidMount()
  {
    this.getNewsData();
  }

  private getNewsData(): Promise<IDepartmentalNews[]>
  {
    let todayDate = new Date();
    let NoOfNews:Number = this.props.NoOfNews !== undefined ? this.props.NoOfNews !== 0 ? this.props.NoOfNews : 5 : 5;
    //let NoOfNews: Number = this.props.NoOfNews !== 0 ? this.props.NoOfNews : 5;
    let query = `/_api/web/Lists/GetByTitle('Departmental News')/Items?$select=Id,Title,NewsTeaser,NewsDescription,Attachments&$expand=Attachments&top=${NoOfNews}&$orderby=Modified desc`;
    return new Promise<IDepartmentalNews[]>((): void =>{
      const sp: SPService = new SPService(this.props.webPartContext);
        sp._getListData(query)
        .then(responseJSON => {
          if(responseJSON != null) {
            let departmentNewsList: IDepartmentalNews[] = [];
              let items:any = responseJSON; 
              if (items != null && items.value != null && items.value.length > 0){  
                items.value.forEach(element => {
                  const listItem: IDepartmentalNews = {
                    Title: element.Title,
                    NewsTeaser: element.NewsTeaser,
                    NewsDescription: element.NewsDescription,   
                    FromDate: element.FromDate,
                    ToDate: element.ToDate,
                    Department: element.Department
                  };
                  departmentNewsList.push(listItem);
              });       
              this.setState({
                departmentalNews: departmentNewsList
            });      
            }           
          };
      });
    });
  }

  public render(): React.ReactElement<IDepartmentalNewsProps> {
    return (
      <div className={ styles.departmentalNews }>
        <div className={ styles.container }>
          <div className={styles.description}>                        
            <h1 style={{margin:'0'}}>Departmental News</h1>
          </div>
          <div>
          {!this.state.departmentalNews &&
          <div>
            <Placeholder 
             iconName = ''
             iconText = 'No deparmental news.'
             description = ''/>
          </div>  
          }
          {this.state.departmentalNews &&
          <div>
            {this.state.departmentalNews.map((p, i) => {
              <div>
                <div>{p.Title}</div>
                <div>{p.NewsTeaser}</div>
              </div>
            })
            }
          </div>  
          }
          </div>
        </div>
      </div>
    );
  }
}
