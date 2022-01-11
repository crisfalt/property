
import React from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import  {InmuebleServices}  from '../../services/InmuebleServices';
import {Button} from "primereact/button";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';


export var eliminarRegistro = function(id) {
    let estateService = new InmuebleServices();
    estateService.eliminarInmuebles(id).then(response => {
          if(response.status === 200){
             return alert(response.message)
          }else{
              return alert(response.title)
          }
    }); 
};



const ButtonAction = ({ handler, touched, hasError, meta }) => (
    <div>
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => eliminarRegistro(meta.id)} style={{ marginRight: '.5em' }}></Button>
                <Link 
                style={{textDecoration: 'none'}}
                to={{
                    pathname: "/inmueble/" + meta.id,
                    state: { fromDashboard: true }
                }}><Button onClick={ localStorage.setItem(meta.id, JSON.stringify(meta.data))} type="button" icon="pi pi-pencil" className="p-button-info"></Button> </Link>
        </div>
)


class IndexInmueble extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            totalRecords: 0,
            estate: null,
            lazyParams: {
                first: 0,
                rows: 10,
                page: 1,
                sortField: null,
                sortOrder: null
            },
            globalFilterValue: '',
            ownerFilterValue: '',
            nameFilterValue: '',
            codeFilterValue: '',
            maxPriceFilterValue: '',
            minPriceFilterValue: '',
            maxYearFilterValue: '',
            minYearFilterValue: '',
        };

        this.loadLazyData = this.loadLazyData.bind(this);
        this.onPage = this.onPage.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onGlobalFilterChange = this.onGlobalFilterChange.bind(this);
        this.priceBodyTemplate = this.priceBodyTemplate.bind(this);
        this.inputOwnerFilterTemplate = this.inputOwnerFilterTemplate.bind(this);
        this.onSearchOwnerFilterChange = this.onSearchOwnerFilterChange.bind(this);
        this.onSearchNameFilterChange = this.onSearchNameFilterChange.bind(this);
        this.onSearchCodeFilterChange = this.onSearchCodeFilterChange.bind(this);
        this.onSearchMaxPriceFilterChange = this.onSearchMaxPriceFilterChange.bind(this);
        this.onSearchMinPriceFilterChange = this.onSearchMinPriceFilterChange.bind(this);
        this.onSearchMaxYearFilterChange = this.onSearchMaxYearFilterChange.bind(this);
        this.onSearchMinYearFilterChange = this.onSearchMinYearFilterChange.bind(this);
        
        
        
        
        this.estateService = new InmuebleServices();
        this.loadLazyTimeout = null;
      }

    loadLazyData() {
            this.setState({ loading: true });

            if (this.loadLazyTimeout) {
                clearTimeout(this.loadLazyTimeout);
            }

            let paramsPage = {
                PageNumber : this.state.lazyParams.page === undefined ? 1 : this.state.lazyParams.page,
                PageSize : this.state.lazyParams.rows,
                Filter: this.state.globalFilterValue
            };

            let bodyPage = {
                "PropertyId": null,
                "OwnerId": null,
                "NameProperty": this.state.nameFilterValue,
                "MinPrice":  this.state.minPriceFilterValue,
                "MaxPrice":  this.state.maxPriceFilterValue,
                "CodeInternal": this.state.codeFilterValue,
                "MinYear":this.state.minYearFilterValue,
                "MaxYear": this.state.maxYearFilterValue,
            };

            this.loadLazyTimeout = setTimeout(() => {
                this.estateService.getInmueblesFind(bodyPage , paramsPage ).then(data => {
                    this.setState({
                        totalRecords: data.meta.totalCount,
                        estate: data.data,
                        loading: false
                    });
                });
            }, Math.random() * 1000 + 250);
    }

    onPage(event) {
        event.page = event.page + 1;
        this.setState({ lazyParams: event }, this.loadLazyData);
    }

    onSort(event) {
        this.setState({ lazyParams: event }, this.loadLazyData);
    }

    inputOwnerFilterTemplate() {
       return (
            <div className="p-d-flex p-jc-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.ownerFilterValue} onChange={this.onSearchOwnerFilterChange} placeholder="Buscar" />
                </span>
            </div>
        )
    }

    onGlobalFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ globalFilterValue: value });
        this.loadLazyData();
    }

    onSearchOwnerFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ownerFilterValue: value });
        this.loadLazyData();
    }

    onSearchCodeFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({codeFilterValue: value });
        this.loadLazyData();
    }


    onSearchNameFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ nameFilterValue: value });
        this.loadLazyData();
    }

    onSearchMaxPriceFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({maxPriceFilterValue: value });
        this.loadLazyData();
    }

    onSearchMinPriceFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ minPriceFilterValue: value });
        this.loadLazyData();
    }

    onSearchMaxYearFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ maxYearFilterValue: value });
        this.loadLazyData();
    }

    onSearchMinYearFilterChange = async e =>{
        const value = e.target.value;
        await this.setState({ minYearFilterValue: value });
        this.loadLazyData();
    }

    actionTemplate(node, column) {
        localStorage.setItem(node.codeInternal, JSON.stringify(node))
        return  ( <ButtonAction meta={{ id: node.id, data: node}}/>)
    }

    actionHeaderTemplate(node, column) {
        return <div>
            <Link style={{textDecoration: 'none'}}
                    to={{
                        pathname: "/inmueble/create",
                        state: { fromDashboard: true }
                }}>
            <Button type="button" icon="pi pi-plus" className="p-button-success" style={{ marginRight: '.5em' }} label="Nuevo"></Button>
            </Link>
        </div>;
    }

    renderHeaderFilters() {
         return (
            <div className="p-d-flex p-jc-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        )
    }

    formatCurrency(value) {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }

    priceBodyTemplate(rowData) {
        return this.formatCurrency(rowData.price);
    }

    async componentDidMount() {
        await this.loadLazyData();
    }
    
 
  render() {
    const filterHeader = this.renderHeaderFilters();
    return <Card title="Listado de inmuebles" subTitle="React V17.0.2 + Primereact">
            <div className="p-dir-col-rev">
                <div className="p-col">
                    <div className="p-grid">
                        <div className="p-col-2">
                           <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={this.state.nameFilterValue} onChange={this.onSearchNameFilterChange} placeholder="Inmueble" />
                        </span>
                        </div>
                        <div className="p-col-2   p-offset-1">
                           <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={this.state.codeFilterValue} onChange={this.onSearchCodeFilterChange} placeholder="Código interno" />
                        </span>
                        </div>
                        <div className="p-col-2   p-offset-1">
                           <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText  type ="number" value={this.state.minPriceFilterValue} onChange={this.onSearchMinPriceFilterChange} placeholder="Min. precio" />
                            </span>
                            
                        </div>
                        <div className="p-col-2   p-offset-1">
                           <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText  type ="number" value={this.state.maxPriceFilterValue} onChange={this.onSearchMaxPriceFilterChange} placeholder="Max. precio" />
                        </span>
                        </div>
                    </div>
                </div>
                 <div className="p-col">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText  type ="number" value={this.state.minYearFilterValue} onChange={this.onSearchMinYearFilterChange} placeholder="Min. Año" />
                            </span>
                            
                        </div>
                        <div className="p-col-2   p-offset-1">
                           <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText  type ="number" value={this.state.maxYearFilterValue} onChange={this.onSearchMaxYearFilterChange} placeholder="Max. Año" />
                        </span>
                        </div>
                    </div>
                 </div>

                <div className="p-col">
                    <DataTable 
                        emptyMessage="No se encontraron resultados."
                        globalFilterFields={['name', 'owner', 'addres', 'price', 'codeInternal', 'year']}
                        header={filterHeader}
                        value={this.state.estate} lazy 
                        responsiveLayout="scroll" 
                        dataKey="id"
                        paginator 
                        first={this.state.lazyParams.first} 
                        rows={10} 
                        totalRecords={this.state.totalRecords} 
                        onPage={this.onPage}
                        onSort={this.onSort} 
                        sortField={this.state.lazyParams.sortField} 
                        sortOrder={this.state.lazyParams.sortOrder}
                        loading={this.state.loading}
                        >
                        <Column field="owner"        header="Dueño"             />
                        <Column field="name"         header="Inmueble" />
                        <Column field="addres"       header="Dirección"         />
                        <Column field="price"        header="Precio"            body={this.priceBodyTemplate}  />
                        <Column field="codeInternal" header="Código Interno" />
                        <Column field="year"         header="Año"               />
                        <Column header={this.actionHeaderTemplate} body={this.actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
                    </DataTable>
                </div>
            </div>
        </Card>
  }
} 

export default IndexInmueble;