import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-republica',
  templateUrl: './republica.page.html',
  styleUrls: ['./republica.page.scss'],
})
export class RepublicaPage implements OnInit {
  
  
  comment_id: number;
  republic_id: number;
  republic: any;
  text_edit: string = '';
  username = localStorage.getItem('username');
  commentForm: FormGroup;
  editCommentForm: FormGroup;
  editMode = false;

  comments = [];

  constructor( 
    public formbuilder:FormBuilder,
    public commentService:CommentService ) { 

    //Pega o republic_id do localStorage
    this.republic_id = JSON.parse(localStorage.getItem('republica')).id;

    this.commentForm = this.formbuilder.group({
      text: [null, [Validators.required, Validators.maxLength(140)]],
    });

    this.editCommentForm = this.formbuilder.group({
      text: [null, [Validators.required, Validators.maxLength(140)]],
    });
  }

  ngOnInit() {

    console.log(this.republic_id);
    console.log(this.republic_id);
    this.showRepublicWithComments(this.republic_id);

  }

  showRepublicWithComments(republic_id) {
    this.commentService.showRepublicWithComments(republic_id).subscribe((res) => {
      console.log(res);
      this.republic = res.republic;
      console.log(this.republic);
      this.comments = res.comments;
      console.log(this.comments);
    }) 
  }

  getCommentId(id) {
    console.log(id);
    this.comment_id = id;
    console.log(this.comment_id);
    for(let comment of this.comments) {
      if(comment.id === id) {
        this.text_edit = comment.text;
      }
    }
    this.editMode = true;
  }

  updateComment(editCommentForm) {
    console.log(editCommentForm);
    console.log(editCommentForm.value)
    this.editMode = false;
    this.commentService.updateComment(this.comment_id, this.editCommentForm.value).subscribe((res) => {
      console.log(res);
      this.text_edit = '';
      this.editCommentForm.reset();
      this.showRepublicWithComments(this.republic_id);
    })
  }
  

  sendComment(commentForm){
    console.log(commentForm);
    console.log(commentForm.value);
    commentForm.value.republic_id = this.republic_id
    commentForm.value.username = this.username;
    this.editMode = false;
    this.commentService.createComment(commentForm.value).subscribe((res) => { 
      console.log(res);
      this.commentForm.reset();
      this.showRepublicWithComments(this.republic_id);
    });
  }


  deleteComment(id){
    
    this.commentService.deleteComment(id).subscribe((res) => {
      console.log(res);
      this.showRepublicWithComments(this.republic_id);
    })
  }

}