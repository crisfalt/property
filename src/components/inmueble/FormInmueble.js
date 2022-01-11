import React from "react";
import {InmuebleServices} from '../../services/InmuebleServices';
import {Button} from "primereact/button";
import {Card} from 'primereact/card';
import {InputText} from 'primereact/inputtext';
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators,
} from "react-reactive-form";
import UploadImages from "../inmueble/UploadFilesInmueble";
import {Dialog} from 'primereact/dialog';
import {Link} from 'react-router-dom';

const TextInput = ({handler, touched, hasError, meta}) => (
    <div>
        <InputText type="text" className="p-d-block p-mb-2" placeholder={`Ingresar ${meta.label}`} {...handler()}/>
        <span style={{color: "red"}}>
        {touched
            && hasError("required")
            && `${meta.label} es requerido`}
    </span>
    </div>
)


class FormInmueble extends React.Component {

    form = FormBuilder.group({
        Name: ["", Validators.required],
        Addres: ["", Validators.required],
        Price: ["", Validators.required],
        CodeInternal: ["", Validators.required],
        Year: ["", Validators.required],
    });

    constructor(props) {
        super(props);
        this.state = {
            title: 'Editar',
            method: null,
            visible: false,
            message: '',
            id: window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1),
        }
        this.estateService = new InmuebleServices();
    }

    handleReset = () => {
        this.loginForm.reset();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let data = null;

        if (this.state.method === 'PATCH') {
            data = [{
                "op": "replace",
                "path": "/Price",
                "value": 67
            }]
        } else {
            data = {
                Name: this.form.controls['Name'].value,
                Addres: this.form.controls['Addres'].value,
                Price: this.form.controls['Price'].value,
                CodeInternal: this.form.controls['CodeInternal'].value,
                Year: this.form.controls['Year'].value,
                OwnerId: 1
            };
        }

        this.estateService.guardarInmuebles(data, this.state.method, this.state.id).then(response => {
            if (response.status) {
                this.setState({message: response.message + 'hea', visible: true});
            }
        })
    }

    async componentDidMount() {
        await this.setState({title: this.state.id === 'create' ? 'Nuevo ' : 'Editar '});
        await this.setState({method: this.state.id === 'create' ? 'POST' : 'PATCH'});
        if (this.state.id !== 'create') {
            this.form.controls['Name'].disable();
            this.form.controls['Addres'].disable();
            this.form.controls['CodeInternal'].disable();
            this.form.controls['Year'].disable();
        }
        this.cargarDatos();
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    eliminarRegistro() {
        this.estateService.eliminarInmuebles(this.state.id).then(response => {
            if (response.status) {
                this.setState({message: response.message, visible: true});
            }
        })
    }


    cargarDatos() {
        let data = JSON.parse(localStorage.getItem(this.state.id));

        this.form.controls['Name'].setValue(data.name);
        this.form.controls['Addres'].setValue(data.addres);
        this.form.controls['CodeInternal'].setValue(data.codeInternal);
        this.form.controls['Year'].setValue(data.year);
        this.form.controls['Price'].setValue(data.price);

    }

    render() {
        const {title, visible, message} = this.state;
        return <Card title={title + 'Inmueble'}>

            <Dialog header="Respuesta" visible={visible} onHide={() => this.onHide('visible')}
                    breakpoints={{'700px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                {message}
            </Dialog>
            <FieldGroup control={this.form} render={({get, invalid}) => (
                <form onSubmit={this.handleSubmit}>
                    <div className="p-grid p-fluid p-justify-center">
                        <div className="p-col-9">
                            <div className="p-grid p-fluid">
                                <div className="p-col-12">
                                    <UploadImages/>
                                </div>
                            </div>
                            <div className="p-grid p-fluid">
                                <div className="p-col-6">
                                <div className="p-grid p-fluid">
                                    <div className="p-col-6 p-field">
                                        <label>Código Interno</label>
                                        <FieldControl
                                            name="CodeInternal"
                                            className="p-d-block p-mb-2"
                                            render={TextInput}
                                            placeholder="Código Interno"
                                            meta={{label: "Código Interno"}}
                                        />
                                    </div>
                                </div>
                                <div className="p-grid p-fluid">
                                    <div className="p-col-11 p-field">
                                        <label>Nombre inmueble</label>
                                        <FieldControl
                                            name="Name"
                                            className="p-d-block p-mb-2"
                                            render={TextInput}
                                            placeholder="Nombre inmueble"
                                            meta={{label: "Nombre inmueble"}}
                                        />
                                    </div>
                                </div>
                                <div className="p-grid p-fluid">
                                    <div className="p-col-11 p-field">
                                        <label>Dirección</label>
                                        <FieldControl
                                            name="Addres"
                                            className="p-d-block p-mb-2"
                                            render={TextInput}
                                            placeholder="Dirección"
                                            meta={{label: "Dirección"}}
                                        />
                                    </div>
                                </div>
                            </div>
                                <div className="p-col-6">
                                <div className="p-grid p-fluid">
                                    <div className="p-col-11 p-field">
                                        <label>Precio</label>
                                        <FieldControl
                                            name="Price"
                                            className="p-d-block p-mb-2"
                                            render={TextInput}
                                            placeholder="Precio"
                                            meta={{label: "Precio"}}
                                        />
                                    </div>
                                </div>
                                <div className="p-grid p-fluid">
                                    <div className="p-col-4 p-field">
                                        <label>Año</label>
                                        <FieldControl
                                            name="Year"
                                            className="p-d-block p-mb-2"
                                            render={TextInput}
                                            placeholder="Año"
                                            meta={{label: "Año"}}
                                        />
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="p-grid p-fluid p-mt-5">
                                <div className="p-col-12">
                                    <div className="p-d-flex p-jc-center">
                                        <div className="p-mr-2">
                                            <Button type="submit" disabled={invalid} icon="pi pi-save" label="Guardar"
                                                    className="p-button-info p-shadow-5"></Button>
                                        </div>
                                        <div className="p-mr-2">
                                            <Link style={{textDecoration: 'none'}}
                                                  to={{
                                                      pathname: "/",
                                                      state: {fromDashboard: true}
                                                  }}>
                                                <Button type="button" label="Cancelar"
                                                        className="p-button-warning p-ml-2 p-shadow-5"></Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                )}
            />
        </Card>
    }
}

export default FormInmueble;
