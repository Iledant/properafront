// Mutation for errors and loading
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'
export const BEGIN_LOADING = 'BEGIN_LOADING'
export const END_LOADING = 'END_LOADING'
// Actions and mutations for PhysicalOps
export const ADD_PHYSICAL_OP = 'ADD_PHYSICAL_OP'
export const ADD_PHYSICAL_OPS = 'ADD_PHYSICAL_OPS'
export const GET_PHYSICAL_OPS = 'GET_PHYSICAL_OPS'
export const GET_PHYSICAL_OPS_FINANCIAL_COMMITMENTS =
  'GET_PHYSICAL_OPS_FINANCIAL_COMMITMENTS'
export const DEL_PHYSICAL_OP = 'DEL_PHYSICAL_OP'
export const UPDATE_PHYSICAL_OP = 'UPDATE_PHYSICAL_OP'
// Actions and mutations for Rights
export const GET_RIGHTS = 'GET_RIGHTS'
export const SET_RIGHTS = 'SET_RIGHTS'
export const INHERIT_RIGHTS = 'INHERIT_RIGHTS'
// Actions and mutations for Events
export const GET_EVENTS = 'GET_EVENTS'
export const ADD_EVENT = 'ADD_EVENT'
export const UPDATE_EVENT = 'UPDATE_EVENT'
export const DEL_EVENT = 'DEL_EVENT'
export const GET_NEXT_MONTH_EVENTS = 'GET_NEXT_MONTH_EVENTS'
// Actions and mutations for Prev
export const GET_PREVISIONS = 'GET_PREVISIONS'
export const GET_ONLY_PREVISIONS = 'GET_ONLY_PREVISIONS'
export const SET_PREVISIONS = 'SET_PREVISIONS'
export const ADD_PREVCOMMITMENTS = 'ADD_PREVCOMMITMENTS'
export const ADD_PREV_PAYMENTS = 'ADD_PREV_PAYMENTS'
export const UPLOAD_PREVCOMMITMENTS = 'UPLOAD_PREVCOMMITMENTS'
export const ADD_MODIFIED_COMMITMENTS = 'ADD_MODIFIED_COMMITMENTS'
export const ADD_MODIFIED_PAYMENTS = 'ADD_MODIFIED_PAYMENTS'
export const SET_FC_PER_BENEFICIARY = 'SET_FC_PER_BENEFICIARY'
export const SET_PAYMENT_PER_BENEFICIARY = 'SET_PAYMENT_PER_BENEFICIARY'
export const SET_OP_PENDING_COMMITMENT = 'SET_OP_PENDING_COMMITMENT'
export const GET_PAYMENT_CREDITS = 'GET_PAYMENT_CREDITS'
export const GET_PAYMENT_CREDIT_JOURNAL = 'GET_PAYMENT_CREDIT_JOURNAL'
export const GET_PAYMENT_NEEDS = 'GET_PAYMENT_NEEDS'
export const CREATE_PAYMENT_NEED = 'CREATE_PAYMENT_NEED'
export const UPDATE_PAYMENT_NEED = 'UPDATE_PAYMENT_NEED'
export const DELETE_PAYMENT_NEED = 'DELETE_PAYMENT_NEED'
export const GET_PAYMENT_NEEDS_AND_FORECAST = 'GET_PAYMENT_NEEDS_AND_FORECAST'
export const GET_PAYMENT_PREVISION = 'GET_PAYMENT_PREVISION'
export const GET_ACTION_PAYMENT_PREVISION = 'GET_ACTION_PAYMENT_PREVISION'
export const GET_CUR_YEAR_ACTION_PMT_PREV = 'GET_CUR_YEAR_ACTION_PMT_PREV'
export const GET_OP_PAYMENT_PREVISION = 'GET_OP_PAYMENT_PREVISION'
export const GET_AVERAGE_PAYMENT_TIME = 'GET_AVERAGE_PAYMENT_TIME'
export const ADD_CMT_OPS_PROPOSAL = 'ADD_CMT_OPS_PROPOSAL'
export const SET_OP_CMT_LINKS = 'SET_OP_CMT_LINKS'
export const GET_CSF_WEEK_TREND = 'GET_CSF_WEEK_TREND'
export const GET_FLOW_STOCK_DELAYS = 'GET_FLOW_STOCK_DELAYS'
export const GET_PAYMENT_RATE = 'GET_PAYMENT_RATE'
// Actions and mutations for Plans
export const ADD_PLAN = 'ADD_PLAN'
export const GET_PLANS = 'GET_PLANS'
export const DEL_PLAN = 'DEL_PLAN'
export const UPDATE_PLAN = 'UPDATE_PLAN'
// Actions and mutations for PlanLines
export const GET_PLAN_LINES = 'GET_PLAN_LINES'
export const GET_DETAILED_PLAN_LINES = 'GET_DETAILED_PLAN_LINES'
export const GET_PLAN_LINES_BENEFICIARIES = 'GET_PLAN_LINES_BENEFICIARIES'
export const ADD_PLAN_LINE = 'ADD_PLAN_LINE'
export const UPDATE_PLAN_LINE = 'UPDATE_PLAN_LINE'
export const DEL_PLAN_LINE = 'DEL_PLAN_LINE'
export const UPLOAD_PLAN_LINE = 'UPLOAD_PLAN_LINE'
// Actions and mutations for Users
export const ADD_USER = 'ADD_USER'
export const GET_USERS = 'GET_USERS'
export const DEL_USER = 'DEL_USER'
export const UPDATE_USER = 'UPDATE_USER'
// Actions and mutations for IDs
export const NEW_NEGATIVE_ID = 'NEW_NEGATIVE_ID'
// Actions for token
export const SET_TOKEN = 'SET_TOKEN'
export const DEL_TOKEN = 'DEL_TOKEN'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'
export const RETRIEVE_TOKEN_FROM_LOCAL_STORAGE =
  'RETRIEVE_TOKEN_FROM_LOCAL_STORAGE'
export const SIGN_IN = 'SIGN_IN'
export const LOG_OUT = 'LOG_OUT'
export const PARSE_MENU_ITEMS = 'PARSE_MENU_ITEMS'
// Actions and mutations for upload
export const ADD_PENDINGS = 'ADD_PENDINGS'
export const ADD_ATTACHMENTS = 'ADD_ATTACHMENTS'
export const ADD_PROGRAMMINGS = 'ADD_PROGRAMMINGS'
export const UPLOAD_PAYMENT_CREDITS = 'UPLOAD_PAYMENT_CREDITS'
export const UPLOAD_PAYMENT_CREDITS_JOURNAL = 'UPLOAD_PAYMENT_CREDITS_JOURNAL'
// Actions and mutations for FinancialCommitments
export const GET_FINANCIAL_COMMITMENTS = 'GET_FINANCIAL_COMMITMENTS'
export const ADD_FINANCIAL_COMMITMENTS = 'ADD_FINANCIAL_COMMITMENTS'
export const GET_UNLINKED_FINANCIAL_COMMITMENTS =
  'GET_UNLINKED_FINANCIAL_COMMITMENTS'
export const SET_FC_OP_UNLINKED = 'SET_FC_OP_UNLINKED'
export const SET_FC_OP_UNLINKED_CURRENT_PAGE_NUMBER =
  'SET_FC_OP_UNLINKED_CURRENT_PAGE_NUMBER'
export const SET_FC_OP_UNLINKED_MAX_PAGE_NUMBER =
  'SET_FC_OP_UNLINKED_MAX_PAGE_NUMBER'
export const SET_FC_PL_UNLINKED = 'SET_FC_PL_UNLINKED'
export const SET_FC_PL_UNLINKED_CURRENT_PAGE_NUMBER =
  'SET_FC_PL_UNLINKED_CURRENT_PAGE_NUMBER'
export const SET_FC_PL_UNLINKED_MAX_PAGE_NUMBER =
  'SET_FC_PL_UNLINKED_MAX_PAGE_NUMBER'
export const LINK_FINANCIAL_COMMITMENTS = 'LINK_FINANCIAL_COMMITMENTS'
export const LINK_FINANCIAL_COMMITMENTS_PL = 'LINK_FINANCIAL_COMMITMENTS_PL'
export const GET_FC_LINKED = 'GET_FC_LINKED'
export const GET_FC_OP_LINKED = 'GET_FC_OP_LINKED'
export const UNLINK_FC_LIST = 'UNLINK_FC_LIST'
export const GET_FC_PL_LINKED = 'GET_FC_PL_LINKED'
export const GET_PENDING_COMMITMENTS = 'GET_PENDING_COMMITMENTS'
export const GET_UNLINKED_PENDING_COMMITMENTS =
  'GET_UNLINKED_PENDING_COMMITMENTS'
export const GET_LINKED_PENDING_COMMITMENTS = 'GET_LINKED_PENDING_COMMITMENTS'
export const GET_OP_PENDING_COMMITMENTS_DATAS =
  'GET_OP_PENDING_COMMITMENTS_DATAS'
export const LINK_PENDING_COMMITMENTS = 'LINK_PENDING_COMMITMENTS'
export const UNLINK_PENDINGS_LIST = 'UNLINK_PENDINGS_LIST'
export const GET_COMMITMENTS_PER_MONTH = 'GET_COMMITMENTS_PER_MONTH'
export const GET_PROGRAMMINGS_PER_MONTH = 'GET_PROGRAMMINGS_PER_MONTH'
export const DOWNLOAD_ALL_PL_UNLINKED_COMMITMENTS =
  'DOWNLOAD_ALL_PL_UNLINKED_COMMITMENTS'
// Actions and mutations for summaries
export const DOWNLOAD_MULTIANNUAL_PROGRAMMATION =
  'DOWNLOAD_MULTIANNUAL_PROGRAMMATION'
export const DOWNLOAD_BUDGET_SCENARIO = 'DOWNLOAD_BUDGET_SCENARIO'
export const GET_MULTIANNUAL_PROGRAMMATION = 'GET_MULTIANNUAL_PROGRAMMATION'
export const GET_BUDGET_ACTION_PROGRAMMATION_AND_YEARS =
  'GET_BUDGET_ACTION_PROGRAMMATION_AND_YEARS'
export const GET_ANNUAL_PROGRAMMATION = 'GET_ANNUAL_PROGRAMMATION'
export const GET_INIT_ANNUAL_PROGRAMMATION = 'GET_INIT_ANNUAL_PROGRAMMATION'
export const DOWNLOAD_COMMITMENT_PER_ACTION = 'DOWNLOAD_COMMITMENT_PER_ACTION'
export const DOWNLOAD_DETAILED_COMMITMENT_PER_ACTION =
  'DOWNLOAD_DETAILED_COMMITMENT_PER_ACTION'
export const DOWNLOAD_PAYMENT_PER_ACTION = 'DOWNLOAD_PAYMENT_PER_ACTION'
export const DOWNLOAD_DETAILED_PAYMENT_PER_ACTION =
  'DOWNLOAD_DETAILED_PAYMENT_PER_ACTION'
export const DOWNLOAD_STATISTICAL_PAYMENT_PER_ACTION =
  'DOWNLOAD_STATISTICAL_PAYMENT_PER_ACTION'
export const DOWNLOAD_STATISTICAL_DETAILED_PAYMENT_PER_ACTION =
  'DOWNLOAD_STATISTICAL_DETAILED_PAYMENT_PER_ACTION'
export const DOWNLOAD_STATISTICAL_CURRENT_YEAR_PAYMENT_PER_ACTION =
  'DOWNLOAD_STATISTICAL_CURRENT_YEAR_PAYMENT_PER_ACTION'
export const GET_BUDGET_ACTION_PROGRAMMATION = 'GET_BUDGET_ACTION_PROGRAMMATION'
export const GET_PROGRAMMATION_PREVISION = 'GET_PROGRAMMATION_PREVISION'
export const GET_PLAN_FORECASTS = 'GET_PLAN_FORECASTS'
// Actions and mutations for payment
export const GET_PAYMENTS = 'GET_PAYMENTS'
export const GET_PAYMENT_DATAS = 'GET_PAYMENT_DATAS'
export const ADD_PAYMENTS = 'ADD_PAYMENTS'
export const GET_PAYMENTS_PER_MONTH = 'GET_PAYMENTS_PER_MONTH'
export const GET_ALL_PAYMENTS_PER_MONTH = 'GET_ALL_PAYMENTS_PER_MONTH'
export const GET_BEN_PMT_CHRONICLES =
  'GET_BEN_PMT_CHRONICLES'
export const GET_PAYMENT_PREVISION_AND_REALIZED =
  'GET_PAYMENT_PREVISION_AND_REALIZED'
// Actions and mutations for scenario
export const GET_SCENARIOS = 'GET_SCENARIOS'
export const ADD_SCENARIO = 'ADD_SCENARIO'
export const DEL_SCENARIO = 'DEL_SCENARIO'
export const UPDATE_SCENARIO = 'UPDATE_SCENARIO'
export const GET_SCENARIO_DATA = 'GET_SCENARIO_DATA'
export const SET_SCENARIO_DATA = 'SET_SCENARIO_DATA'
export const DOWNLOAD_SCENARIO_PAYMENT_PER_ACTION =
  'DOWNLOAD_SCENARIO_PAYMENT_PER_ACTION'
export const DOWNLOAD_SCENARIO_STATISTICAL_PAYMENT_PER_ACTION =
  'DOWNLOAD_SCENARIO_STATISTICAL_PAYMENT_PER_ACTION'
// Actions and mutations for documents
export const GET_DOCUMENTS = 'GET_DOCUMENTS'
export const ADD_DOCUMENT = 'ADD_DOCUMENT'
export const DEL_DOCUMENT = 'DEL_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
// Actions and mutations for beneficiaries
export const GET_BENEFICIARIES = 'GET_BENEFICIARIES'
export const UPDATE_BENEFICIARY = 'UPDATE_BENEFICIARY'
export const GET_BENEFICIARY_COMMITMENT = 'GET_BENEFICIARY_COMMITMENT'
// Actions and mutations for budget tables
export const GET_BUDGET_CHAPTERS = 'GET_BUDGET_CHAPTERS'
export const ADD_BUDGET_CHAPTER = 'ADD_BUDGET_CHAPTER'
export const UPDATE_BUDGET_CHAPTER = 'UPDATE_BUDGET_CHAPTER'
export const DEL_BUDGET_CHAPTER = 'DEL_BUDGET_CHAPTER'
export const GET_BUDGET_SECTORS = 'GET_BUDGET_SECTORS'
export const ADD_BUDGET_SECTOR = 'ADD_BUDGET_SECTOR'
export const DEL_BUDGET_SECTOR = 'DEL_BUDGET_SECTOR'
export const UPDATE_BUDGET_SECTOR = 'UPDATE_BUDGET_SECTOR'
export const GET_BUDGET_PROGRAMS = 'GET_BUDGET_PROGRAMS'
export const ADD_BUDGET_PROGRAM = 'ADD_BUDGET_PROGRAM'
export const ADD_BUDGET_PROGRAMS = 'ADD_BUDGET_PROGRAMS'
export const DEL_BUDGET_PROGRAM = 'DEL_BUDGET_PROGRAM'
export const UPDATE_BUDGET_PROGRAM = 'UPDATE_BUDGET_PROGRAM'
export const GET_BUDGET_ACTIONS = 'GET_BUDGET_ACTIONS'
export const ADD_BUDGET_ACTION = 'ADD_BUDGET_ACTION'
export const ADD_BUDGET_ACTIONS = 'ADD_BUDGET_ACTIONS'
export const DEL_BUDGET_ACTION = 'DEL_BUDGET_ACTION'
export const UPDATE_BUDGET_ACTION = 'UPDATE_BUDGET_ACTION'
export const GET_BUDGET_TABLES = 'GET_BUDGET_TABLES'
export const ADD_BUDGET_CREDIT = 'ADD_BUDGET_CREDIT'
export const UPDATE_BUDGET_CREDIT = 'UPDATE_BUDGET_CREDIT'
export const ADD_BUDGET_CREDITS = 'ADD_BUDGET_CREDITS'
export const GET_BUDGET_CREDITS = 'GET_BUDGET_CREDITS'
export const GET_ALL_BUDGET_CREDITS = 'GET_ALL_BUDGET_CREDITS'
export const GET_MONTH_BUDGET_CREDITS = 'GET_MONTH_BUDGET_CREDITS'
// Actions and mutations for programmings
export const GET_COMMISSIONS = 'GET_COMMISSIONS'
export const ADD_COMMISSION = 'ADD_COMMISSION'
export const UPDATE_COMMISSION = 'UPDATE_COMMISSION'
export const DEL_COMMISSION = 'DEL_COMMISSION'
export const GET_PROGRAMMINGS = 'GET_PROGRAMMINGS'
export const SET_PROGRAMMINGS = 'SET_PROGRAMMINGS'
export const GET_PROGRAMMINGS_YEARS = 'GET_PROGRAMMINGS_YEARS'
export const GET_PROGRAMMINGS_NEEDS = 'GET_PROGRAMMINGS_NEEDS'
// Actions and mutations for pre_programmings
export const GET_PRE_PROGRAMMINGS = 'GET_PRE_PROGRAMMINGS'
export const SET_PRE_PROGRAMMINGS = 'SET_PRE_PROGRAMMINGS'
// Actions and mutation for messages
export const GET_TODAY_MESSAGE = 'GET_TODAY_MESSAGE'
export const SET_TODAY_MESSAGE = 'SET_TODAY_MESSAGE'
export const GET_HOME_DATAS = 'GET_HOME_DATAS'
// Actions and mutations for payment types and ratios
export const GET_PAYMENT_TYPES = 'GET_PAYMENT_TYPES'
export const GET_PAYMENT_RATIOS = 'GET_PAYMENT_RATIOS'
export const UPDATE_PAYMENT_TYPE = 'UPDATE_PAYMENT_TYPE'
export const DELETE_PAYMENT_TYPE = 'DELETE_PAYMENT_TYPE'
export const ADD_PAYMENT_TYPE = 'ADD_PAYMENT_TYPE'
export const GET_YEAR_PAYMENT_RATIOS = 'GET_YEAR_PAYMENT_RATIOS'
export const ADD_YEAR_RATIOS = 'ADD_YEAR_RATIOS'
export const SET_PAYMENT_RATIOS = 'SET_PAYMENT_RATIOS'
// Actions and mutations for import logs
export const GET_IMPORT_LOG = 'GET_IMPORT_LOG'
// Actions and mutations for settings
export const GET_SETTINGS_DATA = 'GET_SETTINGS_DATA'
// Actions and mutations for steps and categories
export const ADD_STEP = 'ADD_STEP'
export const UPDATE_STEP = 'UPDATE_STEP'
export const DEL_STEP = 'DEL_STEP'
export const GET_STEPS = 'GET_STEPS'
export const ADD_CATEGORY = 'ADD_CATEGORY'
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY'
export const DEL_CATEGORY = 'DEL_CATEGORY'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const GET_STEPS_AND_CATEGORIES = 'GET_STEPS_AND_CATEGORIES'
// Actions and mutations for departments ratios
export const GET_OPERATION_DPT_RATIOS = 'GET_OPERATION_DPT_RATIOS'
export const SET_OPERATION_DPT_RATIOS = 'SET_OPERATION_DPT_RATIOS'
export const GET_OPS_WITH_DPT_RATIOS = 'GET_OPS_WITH_DPT_RATIOS'
export const SET_OPERATIONS_DPT_RATIOS = 'SET_OPERATIONS_DPT_RATIOS'
export const GET_COMMITMENTS_PER_DPT = 'GET_COMMITMENTS_PER_DPT'
export const GET_DETAILED_COMMITMENTS_PER_DPT =
  'GET_DETAILED_COMMITMENTS_PER_DPT'
export const GET_DETAILED_PROGRAMMINGS_PER_DPT =
  'GET_DETAILED_PROGRAMMINGS_PER_DPT'
// Global constants
export const TOKEN_ERROR_MESSAGE = [
  'Token invalide',
  'token manquant',
  'token expire',
  'Token expiré'
]
// Consistency checks
export const GET_CONSISTENCY_DATAS = 'GET_CONSISTENCY_DATAS'
export const GET_POSSIBLE_CMTS = 'GET_POSSIBLE_CMTS'
export const LINK_PAYMENT_CMT = 'LINK_PAYMENT_CMT'
// Payment demands
export const UPLOAD_PAYMENT_DEMANDS = 'UPLOAD_PAYMENT_DEMANDS'
export const UPDATE_PAYMENT_DEMAND = 'UPDATE_PAYMENT_DEMAND'
export const GET_PAYMENT_DEMANDS = 'GET_PAYMENT_DEMANDS'
export const GET_PAYMENT_DEMAND_COUNTS = 'GET_PAYMENT_DEMAND_COUNTS'
export const GET_PAYMENT_DEMANDS_STOCK = 'GET_PAYMENT_DEMANDS_STOCK'
// Payment delays
export const GET_PAYMENT_DELAYS = 'GET_PAYMENT_DELAYS'
