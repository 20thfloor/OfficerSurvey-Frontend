import Login from '../components/Auth/Login'
import EmailConfirmation from '../components/Auth/EmailConfirmation/EmailConfirmation'
import SetPassword from '../components/Auth/SetPassword/SetPassword'
import AssignmentList from '../components/Assignment/AssignmentList'
import UploadImage from '../components/UploadImage'
import OfficerSurvey from '../components/Survey'
import OfficerList from '../components/Officers/OfficerList'
import EarlyIntervention from '../components/EarlyIntervention/EarlyIntervention'
import CallBack from '../components/CallBack'
import AddQuestion from '../components/Survey/Questions/AddQuestion'
import SearchByCitizen from '../components/SearchByCitizen/SearchByCitizen'
import CallBackDetail from '../components/CallBack/CallBackDetail'
import SurveyMap from '../components/Map'
import UpdateQuestion from '../components/Survey/Questions/UpdateQuestion'
import OfficerDetails from '../components/Officers/OfficerDetails/OfficerDetails'
import UpdateOfficer from '../components/Officers/UpdateOfficer/UpdateOfficer'
import ResponseDetails from '../components/Survey/ResponseDetails'
import Support from '../components/Support/Support'
import ChangePassword from '../components/Auth/Password/ChangePassword'
import AdminDashboard from '../components/AdminDashboard'
import AdminLogin from '../components/Auth/AdminLogin'
import AdminOfficers from '../components/Officers/AdminOfficers'
import SignupOfficer from '../components/Auth/SignupOfficer/SignupOfficer'
import DepartmentPage from '../components/Departments/DepartmentPage'
import OfficerDashboard from '../components/Dashboard/OfficerDashboard'
import SupervisorDashboard from '../components/Dashboard/SupervisorDashboard'
import Officerdashboard from '../components/Officers/Officerdashboard/Officerdashboard'
import EmployeeFeedback from '../components/Employee360/EmployeeFeedback'
import CreateSurvey from '../components/Employee360/CreateSurvey/CreateSurvey'
import EmployeeSurveyByLink from '../components/Employee360/EmployeeSurveyByLink/EmployeeSurveyByLink'
import EmployeeFeedbackResponse from '../components/Employee360/EmployeeFeedbackResponse/EmployeeFeedbackResponse'
import EmployeeSurveyResponseReport from '../components/Employee360/EmployeeSurveyResponseReport/EmployeeSurveyResponseReport'
import EditEmployeeSurvey from '../components/Employee360/EditEmployeeSurvey/EditEmployeeSurvey'
import CommunityFeedbackList from '../components/CommunityFeedback/CommunityFeedbackList/CommunityFeebackList'
import CreateCommunitySurvey from '../components/CommunityFeedback/CreateCommunitySurvey/CreateCommunitySurvey'
import UpdateCommunitySurvey from '../components/CommunityFeedback/UpdateCommunitySurvey/UpdateCommunitySurvey'
import CommunitySurveyByLink from '../components/CommunityFeedback/CommunitySurveyByLink/CommunitySurveyByLink'
import CommunityFeedbackResponse from '../components/CommunityFeedback/CommunityFeedbackResponse/CommunityFeedbackResponse'
import CommunitySurveyResponseReport from '../components/CommunityFeedback/CommunitySurveyResponseReport/CommunitySurveyResponseReport'
import DragDrop from '../components/DragDrop'
import CreatePollEmployee from '../components/Employee360/CreatePollEmployee/CreatePole'
import CreatePollCommunity from '../components/CommunityFeedback/CreatePollCommunity/CreatePollCommunity'
import UpdatePollEmployee from '../components/Employee360/UpdatePoleEmployee/UpdatePole'
import UpdatePoleCommunity from '../components/CommunityFeedback/UpdatePollCommunity/UpdatePoll'
import Demography from '../components/Dempgraphy/Demography'
import EmployeeSurveyDragndrop from '../components/Employee360/DragDropEmployeeSurvey'
import CommunitySurveyDragndrop from '../components/CommunityFeedback/DragDropCommunitySurvey'
import DemographyOfficer from '../components/DemographyOfficer/DemographyOfficer'
import SurveyList from '../components/SmsSurvey/SmsSurveyList/SurveyList'
import CommunityFeedbackCardComponent from '../components/CommunityFeedback/CommunityFeedbackList/CommunityFeedbackCardComponent'
import OfficerSurveyPage from '../components/Departments/OfficerSurveyPage/OfficerSurveyPage'
const routes = [
  {
    path: '/demographics-officer',
    component: DemographyOfficer,
    access: ['OFFICER'],
    exact: true,
    params: false
  },

  {
    path: '/employee-survey-rearrange/:surveyId',
    component: EmployeeSurveyDragndrop,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/community-survey-rearrange/:surveyId',
    component: CommunitySurveyDragndrop,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/demographics',
    component: Demography,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/update-community-pole/:poleId',
    component: UpdatePoleCommunity,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/update-employee-pole/:poleId',
    component: UpdatePollEmployee,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/employee-feedback-survey/create-pole/:category',
    component: CreatePollEmployee,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/community-feedback/create-pole-community/:category',
    component: CreatePollCommunity,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/survey-rearrange',
    component: DragDrop,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/community-feedback/create-community-survey/:category',
    component: CreateCommunitySurvey,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/employee-feedback-survey/edit-employee-survey/:surveyId',
    component: EditEmployeeSurvey,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/community-feedback/update-community-survey/:surveyId',
    component: UpdateCommunitySurvey,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/employee-feedback-survey/employee-survey-report/:reportId',
    component: EmployeeSurveyResponseReport,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/community-feedback/community-survey-report/:reportId',
    component: CommunitySurveyResponseReport,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/employee-feedback/:responseId',
    component: EmployeeFeedbackResponse,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/community-feedback-response/:responseId',
    component: CommunityFeedbackResponse,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },

  {
    path: '/employee-survey-by-link/:link',
    component: EmployeeSurveyByLink,
    access: ['GUEST'],
    exact: true,
    params: true
  },

  {
    path: '/community-survey-by-link/:link',
    component: CommunitySurveyByLink,
    access: ['GUEST'],
    exact: true,
    params: true
  },

  {
    path: '/employee-feedback-survey/create-survey/:category',
    component: CreateSurvey,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/community-feedback',
    component: CommunityFeedbackCardComponent,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/community-feedback/:category',
    component: CommunityFeedbackList,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/employee-feedback-survey/:category',
    component: EmployeeFeedback,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/employee-feedback',
    component: CommunityFeedbackCardComponent,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/',
    access: ['GUEST'],
    component: Login,
    params: false,
    exact: true
  },

  {
    path: '/login',
    access: ['GUEST'],
    component: Login,
    params: false,
    exact: true
  },

  {
    path: '/signupofficer/:signupId',
    access: ['GUEST'],
    component: SignupOfficer,
    params: true,
    exact: true
  },

  {
    path: '/department/:deptname',
    access: ['GUEST'],
    component: DepartmentPage,
    params: true,
    exact: true
  },
  {
    path: '/department/:deptname',
    access: ['GUEST'],
    component: DepartmentPage,
    params: true,
    exact: true
  },

  {
    path: '/email-verification',
    component: EmailConfirmation,
    access: ['GUEST'],
    params: false,
    exact: true
  },
  {
    path: '/set-password/:emailAddress',
    component: SetPassword,
    access: ['GUEST'],
    exact: false,
    params: true
  },
  {
    path: '/dashboard',
    component: SupervisorDashboard,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/dashboard',
    component: OfficerDashboard,
    access: ['OFFICER'],
    exact: true,
    params: false
  },
  {
    path: '/assignment',
    component: AssignmentList,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/upload-header',
    component: UploadImage,
    access: ['SUPERVISOR'],

    exact: true,
    params: false
  },
  {
    path: '/survey',
    component: OfficerSurvey,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/officer-survey/:id',
    component: OfficerSurveyPage,
    access: ['GUEST'],
    exact: true,
    params: true
  },
  {
    path: '/officers',
    component: OfficerList,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/early-intervention',
    component: EarlyIntervention,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/call-back',
    component: CallBack,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/add-question',
    component: AddQuestion,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/search-citizen',
    component: SearchByCitizen,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/call-back/:callbackId',
    component: CallBackDetail,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/survey-response-by-map',
    component: SurveyMap,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/update-question/:questionId',
    component: UpdateQuestion,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/officer-details/:detailIdOfficer',
    component: OfficerDetails,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/officer-dashboard',
    component: Officerdashboard,
    access: ['OFFICER'],
    exact: true,
    params: true
  },
  {
    path: '/update-officer/:updateIdOfficer',
    component: UpdateOfficer,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/response-details/:detailId',
    component: ResponseDetails,
    access: ['SUPERVISOR'],
    exact: true,
    params: true
  },
  {
    path: '/support',
    component: Support,
    access: ['OFFICER', 'SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/profile',
    component: UpdateOfficer,
    access: ['OFFICER', 'SUPERVISOR'],
    exact: true,
    params: false
  },
  {
    path: '/change-password',
    component: ChangePassword,
    access: ['OFFICER', 'SUPERVISOR'],
    exact: true,
    params: false
  },

  {
    path: '/response-details/:detailId',
    component: ResponseDetails,
    access: ['OFFICER'],
    exact: true,
    params: true
  },

  {
    path: '/super-admin',
    access: ['GUEST'],
    component: AdminLogin,
    params: false,
    exact: true
  },

  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    access: ['ADMIN'],
    exact: true,
    params: false
  },

  {
    path: '/admin-officers',
    component: AdminOfficers,
    access: ['ADMIN'],
    exact: true,
    params: false
  },

  {
    path: '/admin-officer-details/:detailIdOfficer',
    component: OfficerDetails,
    access: ['ADMIN'],
    exact: true,
    params: true
  },
  {
    path: '/response-details/:detailId',
    component: ResponseDetails,
    access: ['ADMIN'],
    exact: true,
    params: true
  },
  {
    path: '/sms-surveys',
    component: SurveyList,
    access: ['SUPERVISOR'],
    exact: true,
    params: false
  }
]
export default routes
