<template>
  <v-card>
    <v-card-title class="secondary">Imports de fichiers</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap align-baseline>
        <v-flex xs12>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger les engagements"
                  @change="checkFile($event,cmtUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant les engagements
                  financiers (AP).
                  <br />Met à jour ou complète les engagements (AP) de Propera.
                  <br />Utiliser uniquement le tableau de bord « Propera import
                  AP » d'IRIS qui a le bon format.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger les dossiers en cours"
                  @change="checkFile($event, pendingsUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant les engagements
                  d'une prochaine commission.
                  <br />Remplace les engagements en cours de Propera à partir des
                  données IRIS.
                  <br />Utiliser uniquement le tableau de bord «Propera import AP
                  en cours» d'IRIS qui a le bon format.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger les paiements"
                  @change="checkFile($event, pmtUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant les mandatements.
                  <br />Met à jour et complète les mandatements de Propera à partir des
                  données IRIS.
                  <br />Utiliser uniquement le tableau de bord «Propera import
                  mandats» d'IRIS qui a le bon format.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger des opérations"
                  @change="checkFile($event, opsUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant des opérations
                  nouvelles ou à mettre à jour.
                  <br />La première ligne doit contenir les noms anglais des champs.
                  <br />3 champs sont obligatoires :
                  <ul>
                    <li>« number » en minuscule, le numéro de l’opération physique</li>
                    <li>« name » en minuscule, le nom de l'opération</li>
                    <li>
                      « isr » en minuscule, booléen, pour savoir si l'opération
                      éligible aux emprunts ISR
                    </li>
                  </ul>Les autres champs sont facultatifs :
                  <ul>
                    <li>« value » évaluation en euros</li>
                    <li>« valuedate » date de valeur de l'évaluation</li>
                    <li>« length » longueur en mètres</li>
                    <li>« tri » TRI exprimé en pourcentage</li>
                    <li>« van » valeur actualisée nette</li>
                    <li>
                      « action » code chiffré de l'action budgétaire de
                      rattachement
                    </li>
                    <li>« payment_types_id » index de la chronique enregistrée</li>
                    <li>« plan_line_id » index de la ligne de plan de rattachement</li>
                  </ul>
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger des besoins d'AP"
                  @change="checkFile($event, cmtPrevUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant les prévisions
                  d'engagement.
                  <br />Met à jour et complète les prévisions d'engagement.
                  <br />Pour une opération donnée, la prévision d'une année du fichier
                  remplace celle de la base de données.
                  <br />La première ligne du fichier doit contenir les noms anglais des
                  champs.
                  <br />L'entête doit contenir « number » en minuscule, le numéro de
                  l’opération physique
                  <br />et les années de prévision à insérer ou modifier.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger une programmation"
                  @change="checkFile($event, programmingsUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant la programmation de
                  l'année.
                  <br />Remplace la programmation de la base de données.
                  <br />Le tableau doit contenir
                  <ul>
                    <li>« number » pour le numéro d’opération</li>
                    <li>« value » pour le montant programmé au cour de l’année</li>
                    <li>
                      « commission_date » pour la date prévisionnelle de la
                      commission permanente ou du conseil régional où sera affecté
                      le montant
                    </li>
                  </ul>Une colonne « year » peut être ajoutée pour préciser l’année de
                  la programmation concernée.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger des liens engagements / opérations"
                  @change="checkFile($event, opCmtLinksUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) permettant de rattacher des
                  engagements aux opérations physiques.
                  <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
                  <ul>
                    <li>« op_number » qui correspond au numéro d’opération physique</li>
                    <li>« coriolis_year »</li>
                    <li>« coriolis_egt_code »</li>
                    <li>« coriolis_egt_num »</li>
                    <li>« coriolis_egt_line »</li>
                  </ul>Ces 4 derniers champs décrivent de manière unique l’engagement
                  dans coriolis.
                  <br />Ils apparaissent dans l’export Excel du tableau de bord
                  d’IRIS.
                  <br />Les données sont directement intégrées par requête dans
                  Propera.
                  <br />Si une erreur est faite dans un des champs, la ligne n’est pas
                  prise en compte
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger des programmes budgétaires"
                  @change="checkFile($event, programUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant une liste de
                  programmes budgétaires.
                  <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
                  <ul>
                    <li>« code » chiffré du programme budgétaire</li>
                    <li>
                      « subfunction » sous fonction de rattachement comportant 2
                      ou 3 chiffres (77 ou 881)
                    </li>
                    <li>« name » intitulé du programme</li>
                    <li>« chapter » chapitre de rattachement (907 ou 908)</li>
                  </ul>Propera tentera d’actualiser l’intituler le nom du programme si
                  un programme existe déjà
                  <br />avec le même code, sous fonction et chapitre.
                  <br />Les autres champs seront ajoutés à condition que le code
                  chapitre puisse être trouvé dans la base de données
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger des actions budgétaires"
                  @change="checkFile($event, actionUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant une liste de actions
                  budgétaires.
                  <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
                  <ul>
                    <li>« code » chiffré de l'action budgétaire</li>
                    <li>« sector » secteur de rattachement de l'action (MO, TMSP...)</li>
                    <li>« name » intitulé du programme</li>
                  </ul>Si l’action existe déjà, son intitulé avec mis à jour.
                  <br />Sinon, l’action est ajoutée à condition que le code secteur et
                  que le code du programme puissent être reconnus.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger les crédits ouverts"
                  @change="checkFile($event, creditsUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant l'export IRIS
                  « PROPERA - budget ».
                  <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
                  <ul>
                    <li>« commission_date » date de calcul des disponibilités</li>
                    <li>« chapter » chapitre des AP concernées (905, 907, 908)</li>
                    <li>« primary_commitment » montant du budget initial</li>
                    <li>« frozen_commitment » montant du gel</li>
                    <li>« reserved_commitment » montant de la mise en réserve</li>
                  </ul>Seuls les éléments nouveaux sont ajoutés à la base de données.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-select
                  :items="plans"
                  v-model="planId"
                  label="Plan"
                  item-value="id"
                  item-text="name"
                  single-line
                  class="mr-2"
                />
                <v-file-input
                  :loading="loading"
                  label="Télécharger des lignes de plan"
                  @change="checkFile($event, planLineUpload)"
                  :disabled="!planId"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant les lignes du plan
                  sélectionné.
                  <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
                  <ul>
                    <li>« name » l'intitulé complet de la ligne de plan</li>
                    <li>« value » le montant de l'engagement régional</li>
                  </ul>Des colonnes optionnelles peuvent être ajoutées :
                  <ul>
                    <li>« descript » pour la description</li>
                    <li>« total_value » pour le montant total financé</li>
                    <li>le code du bénéficiaire pour préciser leur financement</li>
                  </ul>
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger la situation des enveloppes de CP"
                  @change="checkFile($event,pmtCreditUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant la situation des
                  enveloppes de CP importés depuis CORIOLIS.
                  <br />Utiliser uniquement l'export issu de SQL developer.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-file-input
                  :loading="loading"
                  label="Télécharger les mouvements d'enveloppes de CP"
                  @change="checkFile($event,pmtCreditJournalUpload)"
                />
              </v-list-item-content>
              <v-list-item-icon>
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-icon color="primary" v-on="on">info</v-icon>
                  </template>
                  Import d'un fichier Excel (.xlsx) contenant la liste des
                  mouvements d'enveloppes de CP importés depuis CORIOLIS.
                  <br />Utiliser uniquement l'export issu de SQL developer.
                </v-tooltip>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
import { excelUploadFile } from './Utils/excelExport'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'uploads',
  data: () => ({ planId: null }),
  methods: {
    fileError () {
      this.$store.commit(
        types.SET_ERROR_MESSAGE,
        'Erreur de chargement de fichier, vérifier si les colonnes requises sont présentes'
      )
    },
    checkFile (file, callback) {
      if (!file) {
        return
      }
      if (!file.name.endsWith('.xlsx')) {
        this.$store.commit(types.SET_ERROR_MESSAGE, 'Fichier XLSX attendu')
        return
      }
      callback(file)
    },
    actionUpload (file) {
      const expectedHeaders = ['code', 'name', 'sector']
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_BUDGET_ACTION, { BudgetAction: object })
      }
      const parseFunction = b =>
        b.map(o => ({
          code: String(o.code),
          name: String(o.Code),
          sector: o.String(o.Sector)
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError(),
        parseFunction
      )
    },
    cmtUpload (file) {
      const expectedHeaders = [
        'chapter',
        'action',
        'iris_code',
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line',
        'name',
        'beneficiary',
        'beneficiary_code',
        'date',
        'value',
        'app'
      ]
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_FINANCIAL_COMMITMENTS, {
          FinancialCommitment: object
        })
      }
      const parseFunction = f =>
        f.map(o => ({
          chapter: String(o.chapter),
          action: String(o.action),
          iris_code: String(o.iris_code),
          coriolis_year: String(o.coriolis_year),
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_egt_line: String(o.coriolis_egt_line),
          name: String(o.name),
          beneficiary: String(o.beneficiary),
          beneficiary_code: o.beneficiary_code,
          date: o.date,
          value: o.value,
          lapse_date: o.lapse_date,
          app: o.app ? (o.app === 'OUI') : false
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    pmtUpload (file) {
      const expectedHeaders = [
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line',
        'date',
        'number',
        'value',
        'cancelled_value',
        'beneficiary_code'
      ]
      const parseFunction = p =>
        p.map(o => ({
          beneficiary_code: o.beneficiary_code,
          cancelled_value: o.cancelled_value,
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_line: String(o.coriolis_egt_line),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_year: String(o.coriolis_year),
          date: o.date,
          number: String(o.number),
          value: o.value,
          receipt_date: o.receipt_date
        }))
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_PAYMENTS, { Payment: object })
      }
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    opCmtLinksUpload (file) {
      const expectedHeaders = [
        'op_number',
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line'
      ]
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_ATTACHMENTS, { Attachment: object })
      }
      const parseFunction = o =>
        o.map(o => ({
          op_number: String(o.op_number),
          coriolis_year: String(o.coriolis_year),
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_egt_line: String(o.coriolis_egt_line)
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    pendingsUpload (file) {
      const expectedHeaders = [
        'chapter',
        'action',
        'iris_code',
        'name',
        'beneficiary',
        'commission_date',
        'proposed_value'
      ]
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_PENDINGS, { PendingCommitment: object })
      }
      const parseFunction = p =>
        p.map(o => ({
          chapter: String(o.chapter),
          action: String(o.action),
          iris_code: String(o.iris_code),
          name: String(o.name),
          beneficiary: String(o.beneficiary),
          commission_date: o.commission_date,
          proposed_value: o.proposed_value
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    opsUpload (file) {
      const expectedHeaders = ['number', 'name', 'isr']
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_PHYSICAL_OPS, { PhysicalOp: object })
      }
      const parseFunction = p =>
        p.map(o => ({
          number: o.number,
          name: o.name,
          isr: o.isr,
          descript: o.descript ? o.descript : null,
          value: o.value ? o.value : null,
          length: o.length ? o.length : null,
          step: o.step ? o.step : null,
          category: o.category ? o.category : null,
          tri: o.tri ? o.tri : null,
          van: o.van ? o.van : null,
          action: o.action ? String(o.action) : null,
          payment_types_id: o.payment_types_id ? o.payment_types_id : null,
          plan_line_id: o.plan_line_id ? o.plan_line_id : null
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    programmingsUpload (file) {
      const expectedHeaders = ['number', 'value', 'commission_date']
      const parseFunction = parsedItems => {
        return parsedItems.map(item => {
          const returned = {
            value: parseInt(100 * item.value),
            commission_date: parseInt(item.commission_date),
            number: item.number
          }
          if (Object.hasOwnProperty.call(item, 'total_value')) {
            returned.total_value = parseInt(100 * item.total_value)
          }
          if (Object.hasOwnProperty.call(item, 'state_ratio')) {
            returned.state_ratio = parseInt(item.state_ratio)
          }
          return returned
        })
      }
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_PROGRAMMINGS, { Programmings: object })
      }
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    programUpload (file) {
      const expectedHeaders = ['code', 'subfunction', 'name', 'chapter']
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_BUDGET_PROGRAMS, {
          BudgetProgram: object
        })
      }
      const parseFunction = items => items.map(o => ({
        chapter: parseInt(o.chapter),
        name: o.name,
        code: String(o.code),
        subfunction: String(o.subfunction)
      }))
      excelUploadFile(file, expectedHeaders, saveFunction, this.fileError, parseFunction)
    },
    creditsUpload (file) {
      const expectedHeaders = [
        'commission_date',
        'chapter',
        'primary_commitment',
        'frozen_commitment',
        'reserved_commitment'
      ]
      const saveFunction = object => {
        this.$store.dispatch(types.ADD_BUDGET_CREDITS, {
          BudgetCredits: object
        })
      }
      const parseFunction = p =>
        p.map(({ chapter, ...others }) => ({
          chapter: Number(chapter),
          ...others
        }))
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    cmtPrevUpload (file) {
      const expectedHeaders = ['number', 'year', 'value']
      const saveFunction = object => {
        this.$store.dispatch(types.UPLOAD_PREVCOMMITMENTS, {
          PrevCommitment: object
        })
      }
      const parseFunction = a => {
        const r = []
        for (const i of a) {
          const parsed = {
            number: i.number,
            year: i.year,
            value: parseInt(100 * i.value)
          }
          if ('total_value' in i) {
            parsed.total_value = parseInt(100 * i.total_value)
          }
          if ('state_ratio' in i) parsed.state_ratio = i.state_ratio
          r.push(parsed)
        }
        return r
      }
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    planLineUpload (file) {
      const expectedHeaders = ['name', 'value']
      const saveFunction = object => {
        this.$store.dispatch(types.UPLOAD_PLAN_LINE, {
          PlanLine: object,
          id: this.planId
        })
      }
      const errorFunction = msg => {
        this.$store.dispatch(types.SET_ERROR_MESSAGE, msg)
      }
      excelUploadFile(file, expectedHeaders, saveFunction, errorFunction)
    },
    pmtCreditUpload (file) {
      const expectedHeaders = [
        'Chapter',
        'Function',
        'Primitive',
        'Reported',
        'Added',
        'Modified',
        'Movement'
      ]
      const parseFunction = p =>
        p.map(o => ({
          Chapter: Number(o.Chapter),
          Function: Number(o.Function),
          Primitive: parseInt(100 * o.Primitive),
          Reported: parseInt(100 * o.Reported),
          Added: parseInt(100 * o.Added),
          Modified: parseInt(100 * o.Modified),
          Movement: parseInt(100 * o.Movement)
        }))
      const saveFunction = object => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDITS, { PaymentCredit: object })
      }
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    },
    pmtCreditJournalUpload (file) {
      const expectedHeaders = [
        'Chapter',
        'Function',
        'CreationDate',
        'ModificationDate',
        'Name',
        'Value'
      ]
      const parseFunction = p =>
        p.filter(o => Number(o.Chapter) === 907 ||
          Number(o.Chapter) === 908 ||
          (Number(o.Chapter) === 905 && Number(o.Function) === 52)).map(o => ({
          Chapter: Number(o.Chapter),
          Function: Number(o.Function),
          CreationDate: parseInt(o.CreationDate),
          ModificationDate: parseInt(o.ModificationDate),
          Name: o.Name,
          Value: parseInt(100 * o.Value)
        }))
      const saveFunction = object => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDITS_JOURNAL,
          { PaymentCreditJournal: object })
      }
      excelUploadFile(
        file,
        expectedHeaders,
        saveFunction,
        this.fileError,
        parseFunction
      )
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      plans: state => state.plans.plans
    })
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
  }
}
</script>
