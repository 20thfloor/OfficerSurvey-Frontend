/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import DefaultProfilePic from '../../assets/default_profile_pic.png'
import { getAPI, putAPIFormDataWrapper } from '../../utils/api'
import { createFormDataObject } from '../../utils/helpers'
import { officersDepartmentUrl, editDepartmentUrl } from '../../utils/apiUrls'
import OfficerButton from '../Common/OfficerButton'
import DepartmentHeader from '../DepartmentHeader'
import { OfficerCard, OfficerImageUpload } from '../Common'
import { UploadHeading, UploadText } from './UploadImageStyle'
import PropTypes from 'prop-types'

const UploadImage = props => {
  UploadImage.propTypes = {
    notify: PropTypes.any.isRequired
  }
  const [imgSrc, setImgSrc] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)

  const [departmentData, setDepartmentData] = useState({})
  const [newOfficerData, setNewOfficerData] = useState({
    header: ''
  })
  const handleNewOfficerDataChange = e => {
    const { name, files } = e.target
    setNewOfficerData({
      ...newOfficerData,
      [name]: files[0]
    })

    if (name === 'header') {
      var file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      // eslint-disable-next-line
      reader.onload = function (e) {
        const image = new Image()
        image.src = e.target.result
        // eslint-disable-next-line
        image.onload = function () {
          setImgSrc([reader.result])
          return true
        }
      }
    }
  }

  const createOfficer = async () => {

  // alert("Om Success! its working");
     const img = new Image();
   
    const width = img.width;

    // var file  = this.files[0];



    // alert('image width is  '+width); 
    // img.src = imgUrl;
    // img.onload = () => {
    //     const width = img.naturalWidth;
    //     const height = img.naturalHeight;
    //     if (width > 200 || height > 200) {
    //       alert("Om Success! its error");
    //        //return false;
    //     }
    //     alert("Om Success! should work");
    //     //return true;
    // } 


    setShowSpinner(true)
    const formData = createFormDataObject(newOfficerData)
    const res = await putAPIFormDataWrapper(editDepartmentUrl, formData)
    if (!res.isError) {
      setShowSpinner(false)
      props.notify(res.data.data.message, 'success')
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }

  }

  const showImage = async () => {
    setShowSpinner(true)
    const res = await getAPI(officersDepartmentUrl)
    if (!res.isError) {
      setDepartmentData(res.data.data.data)
      setShowSpinner(false)
    } else {
      setShowSpinner(false)
      props.notify(res.error.message, 'error')
    }
  }

  useEffect(() => {
    showImage()
  }, [])

  return (
    <div>
      <OfficerCard>
        <p className="pl-3 py-3">Update Cover Photo</p>
        <Grid container spacing={3} direction="row" justify="center" alignItems="center">
          <Grid item xs={12} sm={12}>
            <div className="d-flex justify-content-center align-items-center pb-5">
              <OfficerImageUpload
                src={imgSrc ? imgSrc : DefaultProfilePic}
                alt="Officer Img for Add Officer"
                type="file"
                placeholder="No file choosen"
                name="header"
                onChange={handleNewOfficerDataChange}
                imgSrcAlt="Upload Cover Photo"
              />
            </div>
          </Grid>
        </Grid>
      </OfficerCard>

      <p className="d-flex justify-content-center">Preview</p>

      <div style={{ width: '100%', marginTop: '20px' }}>
        <DepartmentHeader imgSrc={imgSrc} header={departmentData.header} />
      </div>

      <UploadHeading className="pb-3 pt-4">Choosing the Right Header Photo Size</UploadHeading>
      <UploadText>
        The survey header photo size is minimum 820 pixels wide by 310 pixels tall on desktop. Maximum Height of photo
        could be 320 pixels. However, mobile users will see 640 pixels wide by 360 pixels tall.
        <br />
        <br />
        Too big, and important parts of your content will get cropped out. Too small, and your image will look stretched
        and pixelated. You need an image with Goldilocks potential, something that’s just right. Here’s some more notes
        on having the best header photo:
        <li>For the best results, upload an JPG file less than 5 KB for fastest load time.</li>
        <li>Make sure you compress the photo before uploading it.</li>
      </UploadText>

      <div style={{ margin: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <OfficerButton
          buttonName="Save"
          color="officer"
          variant="small"
          click={createOfficer}
          showSpinnerProp={showSpinner}
          disabled={imgSrc ? false : true}
        />
      </div>
    </div>
  )
}
export default UploadImage
