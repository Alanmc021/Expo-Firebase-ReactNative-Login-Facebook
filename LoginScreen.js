import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native'
import firebase from '../Firebase'
import { Ionicons, SimpleLineIcons, Feather, EvilIcons, Entypo } from '@expo/vector-icons';
import * as Facebook from 'expo-facebook';
import * as Permissions from 'expo-permissions';

export default class LoginScreen extends React.Component {

	constructor() {
		super()
		this.state = {
			email: '',
			senha: '',
			userInfo: null
		}

		this.goToResetPassScreen = this.goToResetPassScreen.bind(this)

		//Olheiro FireBase
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {

				this.props.navigation.navigate('Main')

			}
		})

	}

	goToSigIn = () => {
		this.props.navigation.navigate('SingIn')
	}


	goToResetPassScreen() {
		this.props.navigation.navigate('Forgotten')
	}

	async componentDidMount() {
		await Permissions.askAsync(Permissions.LOCATION);
		 
	}

	logar = () => {

		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.senha)
			.catch((error) => {
				if (error.code == 'auth/wrong-password') {
					alert('Senha incorreta');

				} if (error.code == 'auth/invalid-email') {
					alert('Seu e-mail não é valido.');

				} if (this.state.email == '' || this.state.senha == '') {
					alert('Preencha os campos vazios');
				}
			})
	}


	async loginWithFacebook() {

		//ENTER YOUR APP ID 
		const { type, token } = await Facebook.logInWithReadPermissionsAsync('2270253866638040', { permissions: ['public_profile', 'email'] })

		if (type == 'success') {

			const credential = firebase.auth.FacebookAuthProvider.credential(token)
			const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id.name.picture.type(large)`);
			const userInfo = await response.json()
			this.setState({ userInfo })


			firebase.auth().signInWithCredential(credential).catch((error) => {
				console.log(error)
			})
		}


	}

	info = () => {
		return (
			<View>
				<Text>{this.state.userInfo.id}</Text>
			</View>
		)
	}

	render() {
		return (
			<ImageBackground source={require('../assets/images/bgLogin.png')} style={styles.container}>
				<View style={styles.box01}>
					<Image
						style={{ width: 120, height: 120, margin: 4, marginLeft: 8 }}
						source={require('../assets/images/logoPrincipal.png')}
					/>
				</View>


				<View style={styles.boxInput}>

					<View style={styles.box02}>

						<TextInput keyboardType="email-address"
							style={styles.input01}
							placeholder="Login"
							placeholderTextColor="#fff"
							onChangeText={(email) => { this.setState({ email }) }} />
					</View>

					<View style={styles.box03}>

						<TextInput
							style={styles.input02}
							placeholder="Senha"
							secureTextEntry={true}
							placeholderTextColor="#fff"
							onChangeText={(senha) => { this.setState({ senha }) }} />
					</View>

					<SimpleLineIcons name='user' style={{ position: 'absolute', marginLeft: 30, marginTop: 15 }} size={18} color="#fff" />
					<Feather name='unlock' style={{ position: 'absolute', marginLeft: 30, marginTop: 75 }} size={18} color="#fff" />

				</View>

				<View style={styles.button01}>

					<TouchableOpacity onPress={this.logar} >
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ fontSize: 16, color: '#FFB6C1', fontWeight: "300", margin: 15 }}>Entrar</Text>
							<Ionicons style={{ color: 'white', margin: 10, marginLeft: 175, }} name="md-log-in" size={32} color="green" />
						</View>
					</TouchableOpacity >

				</View>

				<View style={{ marginTop: 473, position: 'absolute' }}>
					<View style={{ marginLeft: 12 }}>
						<TouchableOpacity onPress={this.goToResetPassScreen}>
							<Text style={{ fontSize: 13, color: '#fff' }} >Esqueceu sua senha ?</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 120 }}>
					<View style={styles.button02}>

						<TouchableOpacity onPress={() => { alert("Sistema em manutenção !!") }}>
							<Entypo name='google-' size={25} color="#EE0000" />
						</TouchableOpacity >

					</View>

					<View style={styles.button02}>

						<TouchableOpacity onPress={() => this.loginWithFacebook()}>
							<View style={{ flexDirection: 'row' }}>
								<EvilIcons name='sc-facebook' size={40} color="#4267b3" />
							</View>
						</TouchableOpacity >

					</View>

					<View style={styles.button02}>

						<TouchableOpacity onPress={() => { alert("Sistema em manutenção !!") }}>
							<View style={{ flexDirection: 'row' }}>
								<Entypo name='twitter' size={25} color="#08a0e9" />
							</View>
						</TouchableOpacity >

					</View>
				</View>
				<View style={styles.box04}>

					<View style={styles.box05}>
						<TouchableOpacity onPress={this.goToSigIn}>

							<Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}> Cadastre-se</Text>

						</TouchableOpacity>
					</View>

				</View>

			</ImageBackground >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	
	},
	boxInput: {
		marginTop: 67,

	},
	input01: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 280,
		height: 45,
		fontSize: 15,
		padding: 2,
		paddingLeft: 50,
		margin: 5,
		marginLeft: 9,
		borderWidth: 1,
		borderRadius: 100,
		borderColor: "#E5E8E8",
	},
	input02: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 280,
		height: 45,
		fontSize: 15,
		padding: 5,
		paddingLeft: 50,
		margin: 5,
		marginLeft: 9,
		borderWidth: 1,
		borderRadius: 100,
		borderColor: "#E5E8E8"
	},
	button02: {

		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		fontSize: 16,
		padding: 5,
		paddingLeft: 5,
		margin: 5,
		marginLeft: 9,
		borderWidth: 1,
		borderRadius: 100,
		borderColor: "#E5E8E8",
		backgroundColor: 'white'

	},
	box01: {

		width: 130,
		height: 130,
		backgroundColor: '#fff',
		borderRadius: 32,
		marginTop: 80
	},
	box02: {
		marginBottom: 4
	},
	box03: {

	},
	box04: {
		flex: 1,
		alignItems: 'center',
		marginTop: 15,
		width: 300,
		height: 46,
		fontSize: 26,
	},
	button01: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 280,
		height: 45,
		fontSize: 16,
		padding: 5,
		paddingLeft: 200,
		margin: 5,
		marginLeft: 9,
		borderWidth: 1,
		borderRadius: 100,
		borderColor: "#E5E8E8",
		backgroundColor: 'white',
		marginTop: 400,
		position: "absolute"
	}

})