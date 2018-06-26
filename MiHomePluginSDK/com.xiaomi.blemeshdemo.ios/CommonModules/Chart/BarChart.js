/* @flow */
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React, { Component } from 'react';
import * as C from './constants';
import Grid from './Grid';

const styles = StyleSheet.create({
	default: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'transparent',//设置为透明的，by heyalu
	},
});

export default class BarChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = { };
	}

	_handlePress = (e : Object, dataPoint : number, index : number) => {
		if (this.props.onDataPointPress) {
			this.props.onDataPointPress(e, dataPoint, index);
		}
	};

	_drawBar = (_dataPoint : [number, number], index : number) => {
		const [_x, dataPoint] = _dataPoint;
		const backgroundColor = this.props.color || C.BLUE;
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		let widthPercent = this.props.widthPercent || 0.5;
		if (widthPercent > 1) widthPercent = 1;
		if (widthPercent < 0) widthPercent = 0;

		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;


		const data = this.props.data || [];
		const width = this.props.barWidth || (WIDTH / data.length * 0.5) * widthPercent;
		const scale = HEIGHT / maxBound;
		let height = dataPoint * scale;
		if (height <= 0) height = 0;//最低高度变为0，by heyalu
		return (
			<TouchableWithoutFeedback
				key={index}
				onPress={(e) => this._handlePress(e, dataPoint, index)}
			>
				<View
					style={{
						borderTopLeftRadius: this.props.cornerRadius || 0,
						borderTopRightRadius: this.props.cornerRadius || 0,
						backgroundColor,
						width,
						height,
					}}
				/>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		const data = this.props.data || [];
		if (data.length == 0) return null;//如果没有数据，则返回null, by heyalu
		return (
			<View ref="container" style={[styles.default]}>
				<Grid {...this.props} />
				{data.map(this._drawBar)}
			</View>
		);
	}
}
