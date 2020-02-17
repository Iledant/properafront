<template>
  <v-dialog :value="value" @input="$emit('input', false)">
    <v-card>
      <v-carousel height="600px">
        <v-carousel-item>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs4>
                <p class="subtitle font-weight-medium">Prévisions directes, ratios</p>
                <div class="body-2">
                  <p>
                    Les prévisions directes reposent sur les clés de transformation
                    des AP en CP.
                  </p>
                  <p>
                    Pour cela, on calcule une série de ratios à partir
                    des engagements d'une année. Ce ratio traduit le taux de conversion
                    de ces engagements en paiements au cours années qui suivent.
                  </p>
                  <p>
                    Le premier ratio est calculé comme étant le quotient entre
                    le montant des paiements effectués sur les engagements de
                    l'année et celui des engagements. Le deuxième ratio est le
                    quotient entre les paiements de la deuxième année liés aux
                    engagements de la première année. Et ainsi de suite.
                  </p>
                </div>
              </v-flex>
              <v-flex xs8>
                <v-img max-height="540px" contain src="CmtRatios.svg" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
        <v-carousel-item>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs4>
                <p class="subtitle font-weight-medium">Prévisions directes, calcul</p>
                <div class="body-2">
                  <p>
                    On applique alors ces ratios pour évaluer la production de
                    CP liés à la programmation et aux engagements passés.
                  </p>
                  <p>
                    Pour la prévision de l'année en cours, la prévision est
                    calculée en multipliant le premier ratio par la programmation
                    de l'année en cours, en multipliant le deuxième ratio par
                    les engagements de l'année passée, en multipliant le troisième
                    ratio par les engagements pris deux années avant et ainsi
                    de suite
                  </p>
                  <p>
                    En additionnant ces montants, on reconstitue une prévision
                    directe de crédits paiements.
                  </p>
                  <p>
                    Cependant, cette approche est purement théorique car elle
                    ne tient pas compte d'accélération de rythme de paiement ou
                    au contraire de contraintes budgétaires qui peuvent empêcher
                    de mandater les montants appelés.
                  </p>
                </div>
              </v-flex>
              <v-flex xs8>
                <v-img max-height="540px" contain src="CmtRatiosForecast.svg" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
        <v-carousel-item>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs4>
                <p class="subtitle font-weight-medium">Prévisions par RAM, ratios</p>
                <div class="body-2">
                  <p>
                    Cette méthode s'inspire de la méthode directe mais en calculant
                    les ratios non pas directement sur les engagements d'une
                    année mais sur les reste-à-mandater liés aux engagements
                    d'une année.
                  </p>
                  <p>
                    En pratique, le ratio est calculé comme étant le quotient
                    entre les paiements d'une année et les reste-à-mandater
                    d'une année liés aux engagements. Par exemple, le premier
                    ratio est calculé comme les paiements en 2014 liés aux
                    engagements de 2014, le deuxième ratio comme les paiements
                    effectués en 2015 sur les reste-à-mandater début 2015 des
                    engagements pris en 2014 et ainsi de suite.
                  </p>
                </div>
              </v-flex>
              <v-flex xs8>
                <v-img max-height="540px" contain src="DifCmtRatios.svg" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
        <v-carousel-item>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs4>
                <p class="subtitle font-weight-medium">Prévisions par RAM, calculs</p>
                <div class="body-2">
                  <p>
                    On applique alors ces ratios sur les séries des reste-à-mandater
                    liés à la programmation de l'année en cours et des engagements
                    des années passées.
                  </p>
                  <p>
                    En pratique, on multiplie le premier ratio par le montant
                    de la programmation de l'année en cours, on multiplie le deuxième
                    ratio par le montant des reste-à-mandater des engagements de
                    l'année précédentes, le troisième ratio par le reste-à-mandater
                    des engagements pris deux années auparavant et ainsi de suite.
                  </p>
                  <p>
                    Cette méthode permet théoriquement de tenir compte des avances
                    ou retards dans les paiements et éviter toujours de mandater
                    plus que les AP.
                  </p>
                </div>
              </v-flex>
              <v-flex xs8>
                <v-img max-height="540px" contain src="DifCmtRatiosForecast.svg" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PmtPrevInfoDlg',
  props: {
    value: { type: Boolean, default: false }
  }
}
</script>
