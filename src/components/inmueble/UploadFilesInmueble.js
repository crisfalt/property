import React, { Component } from "react";
import  {InmuebleServices}  from '../../services/InmuebleServices';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
export default class UploadImages extends Component {
   constructor(props) {
    super(props);
    this.state = {
      currentFile: localStorage.getItem('image'),
      previewImage: localStorage.getItem('imagepreview'),
      progress: 0,
      visible: false,
      message: '',
      imageInfos: [],
    };

     this.estateService = new InmuebleServices();

     this.selectFile = this.selectFile.bind(this);
     this.upload = this.upload.bind(this);
     this.onHide = this.onHide.bind(this);
     
  }

   async selectFile(event) {
    localStorage.setItem('image', JSON.stringify(event.files[0]))
    localStorage.setItem('imagepreview',  URL.createObjectURL(event.files[0]))
    await this.setState({
        currentFile: localStorage.getItem('image'),
        previewImage: localStorage.getItem('imagepreview'),
        progress: 0,
        message: ""
    });
    this.upload();
    }

    upload() {
    this.setState({
      progress: 0,
    });

    this.estateService.uploadFiles(this.state.currentFile) 
    .then((response) => {
        if(response.status){
             this.setState({message:response.message, visible:true });
        }
      })
    }

    componentDidMount() {
  }

   onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

  render() {
    const { visible, message, previewImage } = this.state;
    return (<div>
                      <Dialog header="Respuesta" visible={visible} onHide={() => this.onHide('visible')} breakpoints={{'700px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                          {message}
                      </Dialog>
                      <FileUpload name="demo[]" url="./upload" customUpload  uploadHandler={this.selectFile} accept="image/*"/>
              {previewImage && (
                <div className="p-grid">
                  <div className="p-col-9 ">
                    <label>Imagen actual</label>
                  </div>
                  <div className="p-col-9 ">
                       <img className="preview" src={previewImage} alt="" />
                  </div>
                </div>
                )}
            </div>
           
    );
  }
}