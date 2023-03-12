/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Button, Input } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Rating from '@material-ui/lab/Rating'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OfficerAutocomplete, OfficerCard, OfficerInputField } from '../../Common'
import './QuestionStyle.css'
import PropTypes from 'prop-types'

import $ from "jquery";



const Questions = ({ handleQuestionData, item, handleCheckboxData, type, count, submitPoll, id, key }) => {
  Questions.defaultProps = {
    handleQuestionData: () => null,
    submitPoll: () => null,
    type: '',
    handleCheckboxData: () => null,
    id: '',
    key: '',
    count: undefined
  }
  Questions.propTypes = {
    handleQuestionData: PropTypes.func,
    item: PropTypes.any.isRequired,
    handleCheckboxData: PropTypes.func,
    type: PropTypes.string,
    count: PropTypes.number,
    submitPoll: PropTypes.func,
    id: PropTypes.string,
    key: PropTypes.string
  }
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentBoxPlaceHolder, setCommentBoxPlaceHolder] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [commentBoxText, setCommentBoxText] = useState('')

  const { t, i18n: translator } = useTranslation()

  const handleFileUpload = e => {
    handleQuestionData(item, null, '', '', e.target.files[0])
  }

  const handleRating = rating => {
    if (handleQuestionData) handleQuestionData(item, null, '', rating)
  }

  const handleChange = event => {
    const choice = item.choices.find(choice => choice.id === parseInt(event.target.value))

    setShowCommentBox(choice.show_comment_box)
    setCommentBoxPlaceHolder(choice.comment_box_place_holder)
    setSelectedChoice(choice)
    if (item.type === 'Checkbox') {
      if (event.target.checked) {
        if (handleQuestionData) handleQuestionData(item, choice, commentBoxText)
      } else {
        if (handleCheckboxData) handleCheckboxData(item, choice, commentBoxText)
      }
    } else {
      if (handleQuestionData) handleQuestionData(item, choice, commentBoxText)
    }
  }

  const handleChangePoll = event => {
    const choice = item.choices.find(choice => choice.id === parseInt(event.target.value))

    if (handleQuestionData) submitPoll(item, choice, '')
  }

  const handleChangeDropDown = choice => {
    setShowCommentBox(choice.show_comment_box)
    setCommentBoxPlaceHolder(choice.comment_box_place_holder)
    setSelectedChoice(choice)

    if (handleQuestionData) handleQuestionData(item, choice, commentBoxText)
  }
  const handleChangeComment = event => {
    var currentText = event.target.value
    setCommentBoxText(currentText)
    if (handleQuestionData) handleQuestionData(item, selectedChoice, event.target.value)
  }
  const getQuestionTest = () => {
    if (type && item.question_translations) {
      const language = item.question_translations.filter(item => item.language === type)
      if (language.length === 0) return item.question
      return language[0].text
    } else return item.question
  }



  const getChoice = option => {
    if (type && option.choice_translations) {
      const choice = option.choice_translations.filter(item => item.language === type)
      if (choice.length === 0) return option.choice
      return choice[0].text
    } else return option.choice
  }


  //  const myfunct = event => {
  //       alert("Om Success");
  //       //$(this).addClass("active");
  //       $(this).parent().addClass("bluebg");
    
  //    }

  const navRef = React.useRef(null);


      const myfunct = (e) => {
          //   alert('hello');
          // $(".PrivateSwitchBase-input-6").removeClass("activeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
          // $(this).addClass("activeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        
     };

     $(document).ready(function(){
     $(".PrivateSwitchBase-input-6").on('click', function(sss){
      //$('.PrivateSwitchBase-input-6').click(function(event) {
      
      //$(".PrivateSwitchBase-input-6").removeClass("activeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      // $(this).addClass("activeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

      
      // $(".MuiFormControlLabel-root").addClass("activeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
       
      // $(this).closest('.MuiFormControl-root').find('.MuiFormGroup-root').addClass('strike');;
      // 

        $(".MuiFormControlLabel-root").removeClass("active"); 
        $(this).parents('.MuiFormControlLabel-root').addClass("active");
    

      });
    });


//    

$(document).ready(function(){
  $(".PrivateSwitchBase-input-50").on('click', function(sss){
      $(".MuiFormControlLabel-root").removeClass("active"); 
     $(this).parents('.MuiFormControlLabel-root').addClass("active");
    });
 });





  useEffect(() => {
    translator.changeLanguage(type)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])
  return (
    <div id={id} key={key}>
      <OfficerCard>
        <div className="d-flex align-items-center">
          <h2 className="question-style">
            <b className="pr-2 ">Q{count}:</b>
          </h2>
          <h2 className="question-style">
            {getQuestionTest()}
            {item.required ? ' *' : ''}
          </h2>
        </div>

        <Box>
          {item.type === 'Drop Down' ? (
            <>
              <OfficerAutocomplete
                id={'combo-box-question-drop' + item.id}
                fullWidth="true"
                options={item.choices}
                required={item.required}
                placeholder={t('Select Choice')}
                idTextField="Select Choice"
                onChange={(event, newValue) => {
                  if (newValue !== undefined) {
                    return newValue ? handleChangeDropDown(newValue) : null
                  }
                }}
                getOptionLabel={option => getChoice(option)}
              />
            </>
          ) : item.type === 'Multiple Choice' || item.type === 'Poll' || item.type === 'Vote' ? (
            <FormControl component="fieldset">
              <RadioGroup onChange={item.type === 'Poll' ? handleChangePoll : handleChange}>
                {item.choices.map((item, count) => (
                  <FormControlLabel
                    key={`radio${item.id}${count + 2}`}
                    value={item.id.toString()}
                    control={<Radio color="primary" required={item.required} />}
                    label={getChoice(item)}
                    onClick={myfunct}
                    ref={navRef}
                    
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : item.type === 'Text Area' ? (
            <>
              <OfficerInputField
                type="text"
                required={item.required}
                color="primary"
                name="comment"
                placeholder={t('Respond Here')}
                id={`Text Here${item.id}`}
                value={commentBoxText}
                onChange={handleChangeComment}
                maxLength="800"
                multiline
                characterCount
              />
            </>
          ) : item.type === 'Checkbox' ? (
            <>
              {item.choices.map((item, count) => (
                <div key={item.id}>
                  <FormControlLabel
                    key={`check${item.id}${count + 2}`}
                    control={<Checkbox value={item.id} name="checkedI" onChange={handleChange} color="primary" />}
                    label={getChoice(item)}
                  />
                  <br />
                </div>
              ))}
            </>
          ) : item.type === 'Rating' ? (
            <Box component="fieldset" mx={1} borderColor="transparent">
              <Rating
                name={'simple-controlled' + item.id}
                value={item.rating}
                size="large"
                // defaultValue={1}
                onChange={(event, newValue) => {
                  handleRating(newValue)
                }}
              />
            </Box>
          ) : item.type === 'File' ? (
            <Button variant="contained" component="label">
              <Input
                type="file"
                variant="outlined"
                color="primary"
                fullWidth
                placeholder="No file choosen"
                value={item.file}
                onChange={handleFileUpload}
              />
            </Button>
          ) : (
            ''
          )}
        </Box>
        <Box>
          {showCommentBox === true ? (
            <>
              <OfficerInputField
                type="text"
                color="primary"
                name="comment"
                id={`Comment Here${item.id}`}
                value={commentBoxText}
                placeholder={commentBoxPlaceHolder}
                onChange={handleChangeComment}
              />
            </>
          ) : (
            ''
          )}
        </Box>
      </OfficerCard>
    </div>
  )
}

export default Questions
