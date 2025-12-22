
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Linking, BackHandler, StatusBar, Alert } from 'react-native';
import ScreenScroll from './components/ScreenScroll';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';

const PrivacyPolicywithoutLog = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        console.log('PrivacyPolicywithoutLog: hardware back press');
        try {
          if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
            navigation.goBack();
          } else if (navigation && typeof navigation.reset === 'function') {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } else {
            Alert.alert('Navigation', 'Unable to navigate back.');
          }
        } catch (e) {
          console.warn('Back action error', e);
          Alert.alert('Navigation error', 'Could not navigate back.');
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
        backHandler.remove();
        StatusBar.setHidden(false);
      };
    }, [navigation])
  );
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2a3144' : '#fff',
  };
  return (
    <View style={[styles.container, backgroundStyle]}>
      <ScreenScroll contentContainerStyle={styles.scrollContainer}>
         <View  style={[
                styles.sectionContainer,
                { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' }, 
                { borderColor: isDarkMode ? '#444' : '#e0e0e0' } 
              ]}>
              <Text  style={[
                  styles.pageTitle,
                 { color: isDarkMode ? '#fff' : '#1434a4' }
                 ]}>
                 Privacy Policy</Text>
              <Text style={styles.leadText}>
                Privacy is a fundamental right, and at
                  Sarvashine Allrounder Baby Solutions Private Limited
                (hereinafter referred to as We, Us, Allrounder Baby, Sarvashine,
                Company” or Our which expression shall mean and include its
                affiliates, successors and permitted assigns) , it is treated as
                such. The Company owns and operates a platform, Allrounder Baby,
                an online tool providing content such as articles, audio, video,
                photographs, and other materials that optimize a child's
                developmental milestones across multiple domains, including but
                not limited to: Mathematical Analytical Reasoning, Verbal
                Communicative Fluency, Visual Perception, Kinesthetic
                Coordination and Control, Rhythmic and Harmonic Sensitivity and
                Expression, Social Interaction and Understanding, Self-awareness
                and Reflection, Environmental Observation and Appreciation,
                Philosophical Contemplation and Inquiry, Emotional Awareness
                and Regulation, Practical Problem-solving and Application,
                Innovative Imagination and Creation - on our Platform (as
                defined hereinafter) (Services).
              </Text>

              <Text style={styles.leadText}>
                Our website{' '}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Linking.openURL('https://www.allrounderybaby.com')
                  }
                >
                  https://www.allrounderybaby.com
                </Text>
                ,{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => Linking.openURL('https://allrounderbaby.in')}
                >
                  https://allrounderbaby.in
                </Text>
                , and mobile application “allrounder Baby (Allrounder baby App)
                is owned by Sarvashine Allrounder Baby Solutions Private
                Limited. The Website and Allrounder Baby App is hereinafter
                collectively referred to as the "Platform". This privacy policy
                governs Your access to and use of every content, functionality
                and/or Services offered on or through Platform.
              </Text>

              <Text style={styles.leadText}>
                By your (You or Your) accessing, Browse and/or use of the
                Platform or subscribing to our program, You accept and agree to
                comply with and be bound by the terms and conditions (Terms of
                Use) (accessible at{' '}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Linking.openURL('https://www.allrounderbaby.com/TermsofService')
                  }
                >
                  www.allrounderbaby.com/terms-of-use
                </Text>
                ), and Our privacy policy (Privacy Policy) (the Terms of Use and
                Privacy Policy shall together be referred to as Agreements). By
                accessing our Platform, You agree and acknowledge that You are
                bound by the terms contained in the Agreements. Please read the
                Privacy Policy carefully before proceeding. You declare Your
                willingness to abide and be bound by the terms of this Privacy
                Policy throughout Your use of the Platform. If You do not agree
                with the Privacy Policy, please do not use the Platform. The
                Privacy Policy (which may be updated at the sole discretion of
                the Company without intimation) will be effective immediately
                upon Your acceptance of Our terms and conditions, Your use of
                the Platform being indicative of such acceptance. These
                Agreements shall be enforceable against You in the same manner
                as any other written agreement.
              </Text>

              <Text style={[styles.leadText, styles.marginBottom0]}>
                This Privacy Policy is a legally binding document between You and
                Us. The terms of this Privacy Policy will be effective
                uponthe access and/or use of the Platform in any manner. Please
                note that Your data may be collected by Our affiliates outside
                of the Platform and/or Services through in-person meetings,
                participation in conferences and other forums, including but not
                limited to, through forums, responses to promotional and other
                materials. In order to expand Our prospects and range, We may
                have built in data technologies into Our Platform which may use
                additional sources to collect data. Please note that the data
                collected by Us is secured to the best of Our ability.
              </Text>

              <View style={styles.highlightBox}>
                <Text style={[styles.leadText, styles.marginBottom0]}>
                  Please read this Privacy Policy document along with the Terms
                  of Use carefully before You access Our Platform to fully
                  understand what We do. If You do not agree or fully understand
                  the Terms of Use and/or Our Privacy Policy, please do not use
                  the Platform. You hereby provide Your unconditional consent or
                  agreement to Us to collect, retain and process Personal
                  Information (defined under Paragraph 1 hereunder) as provided
                  under section 43A and section 72A of Information Technology
                  Act, 2000.
                </Text>
              </View>

               <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4',
                               marginTop: 10,
                             }
                        ]}>
               1. Personal Information</Text>
              <Text style={styles.leadText}>
                While accessing and/or using Our Platform, We may ask You to
                provide Us with certain information which may be generic or
                personally identifiable information that can be used to contact
                or identify You, which shall include the various types of data
                as classified hereunder ("Personal Information"). Wherever
                possible, We may indicate which fields are required and which
                fields are optional. We use Your Personal Information for the
                conduct of legitimate interests in order to further Our
                prospects. Please note by using/accessing this Platform, You
                consent to the terms of disclosure of information, including
                Personal Information as per the Privacy Policy. By signing up
                with us, you consent to receive updates related to your account
                and program (such as, sign up confirmation, updated terms of
                service, account expiry, program details, webinar details etc)
                on WhatsApp.
              </Text>

               <Text style={styles.leadText}>
                The Company does not take any responsibility of the genuineness
                and/or veracity of the information provided by any third party
                or other users of the Platform.
              </Text>

              <Text style={styles.leadText}>
                Personal Information may include, but is not limited to Your
                name, Your address, Your telephone number, Your email address
                and/or contact information, date of birth or gender or any
                other items that are enumerated in Rule 3 of Information
                Technology (Reasonable Practices and Procedures and Sensitive
                Personal Data of Information) Rules, 2011. We use Your
                information to carry out Our Services, process payments,
                communicate with You, update Our records and generally maintain
                Your transaction history with Us. We also use this information
                to improve the Platform, prevent or detect fraud or abuses and
                enable third parties to carry out technical, logistical or other
                functions on Our behalf. To give You a greater insight into the
                type of information We collect, We have tried to classify the
                information We gather. Please note that this is an inclusive
                list:
              </Text>
    <View style={styles.information}>
      <View style={styles.infoListItem}>
        <View style={styles.infoListItemContent}>
          <Text 
           style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#000' : '#00796B',
                 marginLeft: 5,
              }
            ]}>
          Contact Information:</Text>
          <Text style={styles.leadText}>
            We receive and store any information You enter on the Platform and/or Services or give Us in any other manner.
            You can choose not to provide certain information based on Your preferences. Your general contact information,
            including Your name, photograph, address, telephone number, date of birth, gender, e-mail address, contacts,
            etc. maybe some of the information We collect.
          </Text>
        </View>
      </View>

      <View style={styles.infoListItem}>
        <View style={styles.infoListItemContent}>
           <Text 
           style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#000' : '#00796B',
                   marginLeft: 5,
                 }
            ]}>
          Personalized Information:</Text>
          <Text style={styles.leadText}>
            Depending on Your engagement with Us, We may receive and request You to provide information relating to Your
            experience on the Platform and use of the Services. This may include sharing such information on social
            media, third party sites and with entities that provide services to Us.
          </Text>
        </View>
      </View>
      <View style={styles.infoListItem}>
        <View style={styles.infoListItemContent}>
           <Text 
           style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#000' : '#00796B',
                 marginLeft: 5,
                  }
            ]}>
          Transaction and Technical Information:</Text>
          <Text style={styles.leadText}>
            We receive and store certain types of information whenever You interact with Us. This can be through any
            means, via e-mails, a visit to the Platform or via telephonic communication. We may also receive/store
            information about Your location, address, browser type, browser version, the pages of Our Site that You
            visit, the time and date of Your visit, the time spent on those pages and other statistics including but
            not limited to the internet protocol address of Your device and Your transaction history. We may use this
            information for internal analysis and to provide You with location based services or for services which
            are more personalized.
          </Text>
        </View>
      </View>

      <View style={styles.infoListItem}>
        <View style={styles.infoListItemContent}>
          <Text 
           style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#000' : '#00796B',
                   marginLeft: 5,
                 }
            ]}>
          Third-Party Data:</Text>
          <Text style={styles.leadText}>
            We might receive information about You from other sources and add it to Our user database. By using or
            continuing to use of the Platform, You agree to Our use of Your information (including sensitive personal
            information) in accordance with this Privacy Policy, as may be amended from time to time by the Company in
            its sole discretion. You also agree and consent to Us collecting, storing, processing, transferring and
            sharing information (including sensitive personal information) related to You with third parties or service
            providers for the purposes as set out in this Privacy Policy.
          </Text>
        </View>
      </View>

      <View style={styles.infoListItem}>
        <View style={styles.infoListItemContent}>
           <Text 
           style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#000' : '#00796B',
                 marginLeft: 5,
                 }
            ]}>
          Other Data:</Text>
          <Text style={styles.leadText}>
            Depending on Your engagement with Us, We may request You to provide Us with applicable information that We
            may require in order to render Our Service from time to time.
          </Text>
        </View>
      </View>
    </View>

         <Text  style={[
                            styles.leadText,
                            { marginTop: 20,
                            
                            }
                        ]}>
         
                We may be required to share the aforesaid information with
                government authorities and agencies for the purposes of
                verification of identity or for prevention, detection or
                investigation, including of cyber incidents, prosecution and
                punishment of offences. You agree and consent for Allrounder
                Baby to disclose Your information, if so required, under
                applicable law.
              </Text>

               <Text style={styles.leadText}>
                Information about Your hardware and software may be
                automatically collected by Us. This information can include
                usage information that includes Your interactions with Services,
                device information, such as unique device identifiers, operating
                system information, internet service provider, IP address,
                screen resolution, language, the date and time of each of Your
                log-ins and requests. This information is used for the operation
                of Services, to maintain quality of the Service, and to provide
                general statistics regarding use of Services. This information
                we otherwise receive.
              </Text>

              <Text style={styles.leadText}>
                You agree that Allrounder Baby will have the right, both during
                and after the term of these Privacy Policy, to use, store,
                transmit, distribute, modify, copy, display, sublicense, and
                create derivative works of Personal Information.
              </Text>

              <Text style={styles.leadText}>
                You acknowledge and agree that We use this information to
                provide the Services We offer. In order to do so, We may display
                and share certain information on the Platform for public viewing
                and to third parties respectively. You may specifically request
                Us not to do so by choosing to contact Us on Our help line number
                or e-mail address or can contact the grievance officer, the
                details of whom are set forth in Paragraph 7 below. You may
                peruse the Platform in detail in order to get a better insight
                into the use of such information.
              </Text>

              <Text style={styles.leadText}>
                However, We do not collect any special category of personal data
                including details about Your race, religion, ethnicity,
                religious or philosophical beliefs, sexual orientation, political
                opinions, trade union memberships, information nor do We collect
                any information about any criminal offences or convictions.
              </Text>

              <Text style={styles.leadText}>
                Please note that by not providing Us with complete information
                or by restricting the information to be displayed, might hamper
                Your access to the Platform and Our Services.
              </Text>

              <Text style={styles.leadText}>
                When You use the Platform and/or avail Our Services like the
                discussion forums and You post and/or share Your information
                such as comments, messages, files, photos etc., such information
                may be made available to the public in general, and may be in
                the public domain. All such sharing of information is done
                solely at Your own risk. Please keep this in mind before You
                disclose personal information.
              </Text>

              <Text style={styles.leadText}>
                In the event that Personal Information is disclosed to or
                accessed by an unauthorized party, Allrounder Baby will promptly
                notify You and use reasonable efforts to cooperate with Your
                investigation of the incident. Allrounder Baby will not be
                responsible for any backup, recovery or other steps required to
                ensure that Personal Information is recoverable in the case of
                data loss. You are solely responsible for backing up Your
                Personal Information on a regular basis, and taking appropriate
                steps to safeguard and ensure the integrity of Your Personal
                Information.
              </Text>

              <Text style={styles.leadText}>
                As part of the Services, We may collect certain Personal
                Information (including but not limited to phone number and email
                address), and let You interact with other users of the Platform
                via 'WhatsApp' or other social media or other third party
                service platform. You acknowledge that We do not control what
                users do with the information they obtain from 'WhatsApp' or
                other social media or other third party service platform. You
                acknowledge that We are not responsible or liable for
                interactions involved between users/third parties. We are not
                liable for disputes, claims, losses, injuries or damage of any
                kind that arise out of or relate to the conduct of users of the
                Platform and/or any third party.
              </Text>

              <Text style={styles.leadText}>
                Users agree that by signing up with Us, they may receive
                account-related updates on WhatsApp, including but not limited
                to sign-up confirmations, account expiry alerts, webinar
                invitations, and service updates. By using the Platform, You
                consent to the use of Your contact information for WhatsApp
                communication.
              </Text>

              <Text style={styles.leadText}>
                Allrounder Baby does not sell or rent Your Personal Information
                to third parties. However, We may share Your data with government
                authorities for legal compliance or payment processors for secure
                transaction handling.
              </Text>

              <Text style={styles.leadText}>
                Just as other users may have access to Your Personal
                Information, You too may have access to their Personal
                Information. You agree that You shall only use the Personal
                Information in relation to the use of the Services and shall not
                misuse such personal information for any unsolicited
                communication, marketing or spam. Your breach of these terms
                will be viewed seriously and may result in an immediate
                suspension or termination of Your account and Your access to
                the Services.
              </Text>

              <View style={styles.section} id="third-party">
              <Text style={[
                            styles.sectionHeader,
                           { 
                            color: isDarkMode ? '#fff' : '#1434a4',
                            marginTop: 10
                          }
                        ]}>2. Third Party Activities</Text>
              <Text style={styles.leadText}>
                The Platform acts as a platform to facilitate education
                technology Services. In order to better Our Services and improve
                the quality of the Platform, We may onboard third-party service
                providers at Our sole discretion from time to time.
              </Text>

              <Text style={styles.leadText}>
                However, the Platform may contain links to other websites owned
                and operated by any third parties who are not related to the
                Platform or the Company in any manner (Linked Website). The
                Company provides these links to You as a convenience only and
                the inclusion of any link does not imply any endorsement of the
                Linked Website by Us. Your link to any such Linked Website is
                entirely at Your own risk. The Company is not a party to any
                transaction between You and a Linked Website. Your use of a
                Linked Website is subject to the terms and conditions of that
                site.
              </Text>

              <Text style={styles.leadText}>
                Allrounder Baby is not responsible for any form of transmission,
                whatsoever, received by You from any third party websites.
                Accordingly, Allrounder Baby does not make any representations
                concerning the privacy practices or policies of such third
                parties or terms of use of such third party websites, nor does
                Allrounder Baby control or guarantee the accuracy, integrity, or
                quality of the information, data, text, software, music, sound,
                photographs, graphics, videos, messages or other materials
                available on such third party websites. The inclusion or
                exclusion does not imply any endorsement by Allrounder Baby of
                the third party websites, the website's provider, or the
                information on the website. The information provided by You to
                such third party websites shall be governed in accordance with
                the privacy policies of such third party websites and it is
                recommended that You review the privacy policy of such third
                party websites prior to using such websites.
              </Text>

              <Text style={styles.leadText}>
                The Platform may also contain third party advertisements, if any.
                The display of such advertisements does not in any way imply an
                endorsement and/or recommendation of the relevant advertiser,
                its products and/or services. You are referred to the relevant
                advertiser for all information regarding the advertisement and
                its products and/or services. The Company accepts no
                responsibility for any interaction between You and the relevant
                third party and is released from any liability arising out of or
                in any way connected with such interaction.
              </Text>

              <Text style={styles.leadText}>
                We acquire, maintain and process Personal Information where it
                is necessary for the legitimate pursuit of Our business
                interests. Legitimate interests include establishing and
                maintaining relationships, servicing their anticipated and actual
                needs, and for administrative purposes. Towards that end, We may
                use various contact management, analytics and processing software
                and other tools and techniques, including marketing by use of
                electronic means.
              </Text>

              <Text style={styles.leadText}>
                We may share personal data, including stored cookies (detailed
                in Paragraph 3) with entities that provide services to Us,
                including companies that provide web analytics, advertising,
                email distribution and other services. The use of personal data
                by such companies is limited to the purpose of rendering the
                contracted Services. Please note that in order to facilitate Our
                Services, We may share Personal Information to third parties to
                the extent required by it to comply with its obligations under
                applicable law.
              </Text>

              <Text style={styles.leadText}>
                We may share Personal Information with one or more of Our group
                companies (if applicable) for performance of business functions
                and for internal analytics. Some of Our group companies or
                service providers may be located in jurisdictions that are
                outside of the jurisdiction of the personal data subject, or in
                jurisdictions that offer a lower level of privacy or data
                protection. In such circumstances, We have put in place
                appropriate safeguards in accordance with applicable law and in
                line with this policy.
              </Text>

              <Text style={styles.leadText}>
                We may also process Personal Information where it is necessary
                for entering into and/or performing under a contract. Finally,
                in certain circumstances, We may process Personal Information on
                the basis of consent of the data subject for specific purposes.
              </Text>

              <Text style={styles.leadText}>
                Unaffiliated third parties are providers of avenues, content,
                functionality and services for Our web and social media sites.
                The third party service providers We use inter alia for storing
                data, its collection and analysis and their respective privacy
                policies are provided herein below.
              </Text>

              <Text style={styles.leadText}>
                We do not control what and how these and other third parties
                collect personal data or how they use it. We do know, however,
                that in addition to using sophisticated technologies such as
                cookies and web beacons on web and social media sites, including
                sites such as Ours, third parties routinely employ new and
                innovative tools, techniques and practices to collect, receive,
                process, buy and sell Personal Information over extended
                durations, build sophisticated user profiles and commercially
                exploit it. We do not control and are not responsible for the
                privacy and business practices of these third parties. Note here
                that certain activities can potentially be managed by users
                themselves, as for instance, through internet browser and
                handheld app controls.
              </Text>
            </View>

             <View style={styles.section} id="cookies">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>3. Cookies</Text>
              <Text style={styles.leadText}>
                When You use the Platform, We try to make that experience
                simple and meaningful. In order to do so, We use
                Cookies which are small
                pieces of information that are issued to Your computer or mobile
                device when You visit a website or access or use a mobile
                application, and that stores and sometimes tracks information
                about Your use of the Platform. These files contain a small
                amount of data, which may include an anonymous unique
                identifier. In general, cookies are sent to Your browser from a
                web site and stored on Your computer's hard drive. We use them
                to recognize Your browser and to provide a more personalized
                experience for You which includes personalized advertisements on
                other websites and storage of items in Your Cart between visits
                thereby ensuring that Your experience with Us is simplified.
                When You visit Our Platform and/or use Our Services, Our web
                server sends a cookie to Your computer or mobile device.
              </Text>

              <Text style={styles.leadText}>
                Please note that some of the cookies used by the Platform are
                set by Us, and some are set by third parties who are delivering
                services on Our behalf.
              </Text>

              <Text style={styles.leadText}>
                We use cookies for other reasons as well. Like many sites, We
                too use cookies to collect information. We also use Cookies to
                allow You to enter Your password less frequently during a
                session. You can instruct Your browser to refuse all cookies or
                to indicate when a cookie is being sent. However, if You do not
                accept cookies, You may not be able use some portions of the
                Platform and/or Services. If You do leave cookies turned on, be
                sure to sign off when You finish using a shared computer.
              </Text>

              <Text style={styles.leadText}>
                The help menu on the menu bar of most browsers will tell You how
                to prevent Your browser from accepting new cookies, how to have
                the browser notify You when You receive a new cookie and how to
                disable cookies altogether. Additionally, You can disable or
                delete similar data used by browser add-ons, such as Flash
                cookies, by changing the add-on's settings or visiting the
                website of its manufacturer.
              </Text>

              <Text style={styles.leadText}>
                However, because cookies allow You to take advantage of some of
                the Platform essential features, We recommend that You leave them
                turned on.
              </Text>
            </View>

             <View style={styles.section} id="data-retention">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>4. Data Retention</Text>
              <Text style={styles.leadText}>
                We will only retain Your personal data for as long as necessary
                to fulfil the purposes We collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements.
              </Text>

              <Text style={styles.leadText}>
                To determine the appropriate retention period for personal data,
                We consider the amount, nature, and sensitivity of the personal
                data, the potential risk of harm from unauthorized use or
                disclosure of Your personal data, the purposes for which We
                process Your personal data and whether We can achieve those
                purposes through other means, and the applicable legal
                requirements.
              </Text>

              <Text style={styles.leadText}>
                In some circumstances We may anonymize Your personal data (so
                that it can no longer be associated with You) for research or
                statistical purposes in which case We may use this information
                indefinitely without further notice to You.
              </Text>
            </View>

                <View style={styles.section} id="unsubscribe">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>5. Right to Unsubscribe</Text>
              <Text style={styles.leadText}>
                You always have the option to not provide information by choosing
                not to use the Platform or a particular feature/Service thereof
                (where such feature is available for opt-out). We may
                automatically use Our available technology to retain Your
                preferences.
              </Text>

              <Text style={styles.leadText}>
                Users have the right to withdraw consent for data processing at
                any time. However, withdrawal of certain permissions (such as
                KYC information for cashback and referral programs) may result
                in ineligibility for these programs. To request deletion of
                stored data, users can email{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => Linking.openURL('mailto:support@allrounderbaby.com')}
                >
                  support@allrounderbaby.com
                </Text>{' '}
                and We will comply with applicable legal and regulatory
                obligations in processing such requests.
              </Text>

              <Text style={styles.leadText}>
                When You update information, We usually keep a copy of the
                previous version for Our records. If You do not want to receive
                updates from Us, please update Your preferences or write to us
                at. However, opting out of updates still governs Your use of the
                Platform and Services under the Terms of Use and Privacy Policy.
              </Text>
            </View>

              <View style={styles.section} id="user-eligibility">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>
                6. Persons Allowed to Use the Platform
              </Text>
              <Text style={styles.leadText}>
                Use of the Platform is available only to individuals who can form
                a legally binding contract under the Indian Contract Act, 1872.
                If You are a minor i.e. under the age of 18 (eighteen) years,
                You may use the Platform only with the consent and involvement
                of a parent or guardian. We do not knowingly collect or store
                personal data of a minor unless permitted by the parent or legal
                guardian of such minor. Please note that in the event such
                persons utilize the Platform and/or the Services, it is assumed
                that he/she/the legal guardian or parent who has enrolled/ given
                access to the Platform/ Services has authorized the person for
                such use and thereby accorded their consent for the terms of the
                Privacy Policy. Use of the Platform is available only to
                individuals who can legally enter into a contract under the
                Indian Contract Act, 1872. Minors under the age of 18 may use
                the Platform only with the consent and active supervision of a
                parent or legal guardian. If We become aware that a minor has
                provided Personal Information without proper consent, We will
                take appropriate steps to remove such information.
              </Text>
            </View>

             <View style={styles.section} id="grievances">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>7. Grievances</Text>
              <Text style={styles.leadText}>
                Allrounder Baby strives to address any of Your concerns
                expeditiously. You may report any concern to our grievance
                officer:
              </Text>

            <View
      style={{
        margin: 5, 
        padding: 10, 
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1, 
        borderColor: '#ddd',
        marginBottom: 20,
      }}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Name: Anurag Vaishya</Text>
      <Text  style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold',  }}>Email:</Text>{' '}
        <Text
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL('mailto:admin@allrounderbaby.in')}
        >
          admin@allrounderbaby.in
        </Text>
      </Text>

      <Text>
        <Text style={{ fontWeight: 'bold' }}>Address:</Text>{' '}
        <Text
          style={{ color: 'blue', textDecorationLine: 'underline' }} 
        >
          Flat A 304 Royal City, Potiya Road, Durg - 491001, Chattisgarh, India
        </Text>
      </Text>
    </View>
           
            </View>

            <View style={styles.section} id="grievances">
              <Text style={[
                            styles.sectionHeader,
                            { color: isDarkMode ? '#fff' : '#1434a4' }
                        ]}>8. Changes to This Privacy Policy</Text>
              <Text style={styles.leadText}>
                We reserve the right to update or change Our Privacy Policy at any time and You should check this Privacy Policy periodically. Your continued use of the Service and the Platform after We post any modifications to the Privacy Policy on this page will constitute Your acknowledgment of the modifications and Your consent to abide and be bound by the modified Privacy Policy.
              </Text>
                <Text style={styles.leadText}>
               We reserve the right to update or modify this Privacy Policy at any time, including changes related to payment processing, foreign exchange handling, and KYC compliance. Any material changes will be communicated via a notice on the Platform and/or email notification to affected users. Continued use of the Platform following such updates constitutes acceptance of the revised policy.
              </Text>

              <Text style={styles.leadText}>  
                If We make any material changes to this Privacy Policy, We will notify You either by placing a prominent notice on the Platform and/or Services.
              </Text>
            </View>
            </View>     
  </ScreenScroll>
    </View>

  );
};

const styles = StyleSheet.create({
  information: {
    flex: 1,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#E0F7FA',
  },
  infoListItem: {
    flexDirection: 'row',
    marginBottom: 20,
    borderColor: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  leadText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 15,
    color: '#666',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: -10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#1434a4',
    paddingHorizontal: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  marginBottom0: {
    marginBottom: 0,
  },
  highlightBox: {
    backgroundColor: '#e9f7ef',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
    marginVertical: 20,
  },
  infoList: {
    marginTop: 10,
  },
  infoListItemContent: {
    marginLeft: -8,
    flex: 1,
  },
  grievanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    marginBottom: 20,
  },
});


export default PrivacyPolicywithoutLog;
